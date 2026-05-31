import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Order } from '../models/Order';
import { Product } from '../models/Product';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Order items are required' });
      return;
    }

    let totalAmount = 0;
    const orderItems = [];

    // Verify stock and compute prices
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404).json({ message: `Product not found: ${item.product}` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
        return;
      }

      // Deduct stock
      await Product.findByIdAndUpdate(product._id!, {
        stock: product.stock - item.quantity,
      });

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id!,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const defaultStages = [
      { stage: 'Order Placed', timestamp: new Date(), completed: true },
      { stage: 'Processing', timestamp: new Date(), completed: false },
      { stage: 'Shipped', timestamp: new Date(), completed: false },
      { stage: 'Delivered', timestamp: new Date(), completed: false },
    ];

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      shippingAddress,
      paymentStatus: 'completed', // Simulate immediate successful authorization
      deliveryStages: defaultStages,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let orders;
    if (role === 'admin') {
      orders = await Order.find({});
    } else {
      orders = await Order.find({ user: userId });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId || !id) {
      res.status(400).json({ message: 'Invalid request' });
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Access control
    if (order.user !== userId && role !== 'admin') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order details', error });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      res.status(400).json({ message: 'Order ID and Status required' });
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Update stages completed states based on status
    const stages = (order.deliveryStages || []).map((stage: any) => {
      const matchStatus = stage.stage.toLowerCase() === status.toLowerCase() || 
                          (status === 'processing' && stage.stage === 'Processing') ||
                          (status === 'shipped' && ['processing', 'shipped'].includes(stage.stage.toLowerCase())) ||
                          (status === 'delivered' && ['processing', 'shipped', 'delivered'].includes(stage.stage.toLowerCase()));
      
      return {
        ...stage,
        completed: stage.completed || matchStatus,
        timestamp: matchStatus ? new Date() : stage.timestamp,
      };
    });

    const updated = await Order.findByIdAndUpdate(id, {
      status,
      deliveryStages: stages,
    }, { new: true });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};
