import express from 'express';
import { getTeacherPositions, createTeacherPosition } from '../controllers/teacherPositionController.js';

const router = express.Router();
router.get('/', getTeacherPositions);
router.post('/', createTeacherPosition);

export default router;