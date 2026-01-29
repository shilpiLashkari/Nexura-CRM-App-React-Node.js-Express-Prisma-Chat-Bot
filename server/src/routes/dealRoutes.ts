import { Router } from 'express';
import { getDeals, createDeal, updateDeal, deleteDeal } from '../controllers/dealController';

const router = Router();

router.get('/', getDeals);
router.post('/', createDeal);
router.put('/:id', updateDeal);
router.delete('/:id', deleteDeal);

export default router;
