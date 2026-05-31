import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    
    let query: any = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = new RegExp(search as string, 'i');
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let products = await Product.find(query);

    // Apply sorting
    if (sort) {
      if (sort === 'price-low') {
        products.sort((a: any, b: any) => a.price - b.price);
      } else if (sort === 'price-high') {
        products.sort((a: any, b: any) => b.price - a.price);
      } else if (sort === 'name') {
        products.sort((a: any, b: any) => a.name.localeCompare(b.name));
      }
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Product ID required' });
      return;
    }
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product detail', error });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;
    const newProduct = await Product.create({
      ...productData,
      stock: Number(productData.stock || 0),
      price: Number(productData.price || 0),
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Product ID required' });
      return;
    }
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Product ID required' });
      return;
    }
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({ message: 'Product deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

export const addProductReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, text, user } = req.body;

    if (!id) {
      res.status(400).json({ message: 'Product ID required' });
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const reviews = product.reviews || [];
    const newReview = {
      _id: 'rev_' + Math.random().toString(36).substring(2, 9),
      user: user || 'Guest_User',
      rating: Number(rating || 5),
      text: text || '',
      createdAt: new Date()
    };

    reviews.push(newReview);
    product.reviews = reviews;

    // Recalculate average rating and review count
    const totalRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    product.rating = Number((totalRating / reviews.length).toFixed(1));
    product.numReviews = reviews.length;

    await Product.findByIdAndUpdate(id, product);

    res.status(201).json({ 
      message: 'Review added successfully', 
      review: newReview, 
      rating: product.rating, 
      numReviews: product.numReviews 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error });
  }
};
