import { Request, Response } from 'express';
import Note from '../models/noteModel';

interface CustomRequest extends Request {
  user?: any;
}

export const createNote = async (req: CustomRequest, res: Response): Promise<void> => {
  const { content } = req.body;

  if (!content) {
    res.status(400).json({ message: 'Content is required' });
    return;
  }

  try {
    const note = await Note.create({
      user: req.user._id,
      content,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create note' });
  }
};

export const getNotes = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

export const deleteNote = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
};
