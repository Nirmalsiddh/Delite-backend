import express from 'express';
import { createNote, getNotes, deleteNote } from '../controllers/noteControllers';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createNote);
router.get('/', protect, getNotes);
router.delete('/:id', protect, deleteNote);

export default router;
