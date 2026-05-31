import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AIProfile } from '../models/AIProfile';
import { Product } from '../models/Product';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Google Gen AI only if API key is provided
let aiClient: GoogleGenAI | null = null;
if (GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

// Fallback rule-based responses
const cyberpunkResponses = [
  "Affirmative. Scanned the Nexus mesh networks. The product aligns perfectly with your neural bandwidth.",
  "Warning: High demand detected in Neo-Tokyo sector. Order telemetry suggests restocking will take 48 cycles.",
  "System diagnostics show this unit operates at 99.8% thermal efficiency under full simulated loading.",
  "Analyzing grid specs... yes, the quantum overlay provides fully synchronous spatial updates.",
  "Recommended pairing: combine this unit with our Haptic VR Harness to maximize tactile interface feedback."
];

export const chatCopilot = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ message: 'Message is required' });
      return;
    }

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are Nexus-AI, the advanced cyberpunk shopping copilot for Nexus Commerce X. Answer the following user query with a futuristic, helpful, and concise response:\n\n${message}`,
        });
        res.status(200).json({ response: response.text });
        return;
      } catch (geminiError) {
        console.error('Gemini API call failed, falling back:', geminiError);
      }
    }

    // Rule-based fallback
    const randomResponse = cyberpunkResponses[Math.floor(Math.random() * cyberpunkResponses.length)]!;
    res.status(200).json({
      response: `[LOCAL CORE] ${randomResponse} (Fallback active: API key offline)`
    });
  } catch (error) {
    res.status(500).json({ message: 'AI Copilot error', error });
  }
};

export const getAIProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let profile = await AIProfile.findOne({ user: userId });
    
    // Auto-create a cool futuristic default profile if none exists
    if (!profile) {
      const allProducts = await Product.find({});
      const randomProducts = allProducts.slice(0, 3).map((p: any) => p._id!);
      
      profile = await AIProfile.create({
        user: userId,
        shoppingPersona: 'Quantum Tech Specialist',
        colorPreferences: ['#00f0ff', '#ff007f'],
        interestCategories: ['Quantum Computing', 'Holographic Displays', 'Wearables'],
        averageSpend: 1250,
        recommendedProducts: randomProducts,
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving AI Profile', error });
  }
};

export const generateProfileDNA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { answers } = req.body; // Array of survey responses or sliders

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const personas = [
      'Cybernetic Augmentation Architect',
      'Netrunner Specialist',
      'Grid Explorer',
      'Neo-Industrial Designer',
      'Bio-Hacker Enthusiast'
    ];

    const categories = [
      ['Cyberware', 'Decks', 'Neuromodulators'],
      ['Cyberdecks', 'Monitors', 'Synapse Links'],
      ['Vehicles', 'Exo-suits', 'Boosters'],
      ['Displays', 'Wearables', 'Peripherals'],
      ['Medical Tech', 'Bio-links', 'Implants']
    ];

    // Pick a pseudo-random slice based on input or index
    const index = Math.floor(Math.random() * personas.length);
    const chosenPersona = personas[index]!;
    const chosenCategories = categories[index]!;
    const allProducts = await Product.find({});
    const randomProducts = allProducts.slice(index, index + 3).map((p: any) => p._id!);

    let profile = await AIProfile.findOne({ user: userId });
    if (!profile) {
      profile = await AIProfile.create({
        user: userId,
        shoppingPersona: chosenPersona,
        interestCategories: chosenCategories,
        recommendedProducts: randomProducts,
        averageSpend: Math.floor(Math.random() * 2000) + 500,
      });
    } else {
      profile = await AIProfile.findByIdAndUpdate(
        profile._id,
        {
          shoppingPersona: chosenPersona,
          interestCategories: chosenCategories,
          recommendedProducts: randomProducts,
          averageSpend: Math.floor(Math.random() * 2000) + 500,
        },
        { new: true }
      );
    }
    const updatedProfile = profile;

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error generating DNA Profile', error });
  }
};
