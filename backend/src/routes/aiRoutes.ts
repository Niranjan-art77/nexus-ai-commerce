import { Router } from 'express';
import { 
  chatCopilot, 
  getAIProfile, 
  generateProfileDNA 
} from '../controllers/aiController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/copilot', chatCopilot);
router.get('/profile', authenticateToken, getAIProfile);
router.post('/dna', authenticateToken, generateProfileDNA);

export default router;
