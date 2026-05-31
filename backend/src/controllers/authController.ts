import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus-super-secret-key-2026';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'customer',
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ userId: newUser._id, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: { id: newUser._id, name: newUser.name, email: newUser.email, role: 'customer' }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role || 'customer' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role || 'customer' }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role || 'customer' } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const elevateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const requestedRole = req.body.role;
    const validRoles = ['customer', 'admin', 'seller', 'delivery', 'support'];
    const newRole = (requestedRole && validRoles.includes(requestedRole))
      ? requestedRole
      : (user.role === 'admin' ? 'customer' : 'admin');
    
    user.role = newRole;
    await User.findByIdAndUpdate(userId, { role: newRole });

    const token = jwt.sign({ userId: user._id, role: newRole }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      message: `Terminal authority elevated to ${newRole.toUpperCase()}`, 
      user: { id: user._id, name: user.name, email: user.email, role: newRole }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error elevating authority', error });
  }
};
