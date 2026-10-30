import express from 'express';
import { getTeachers, createTeacher } from '../controllers/teacherController.js';

const router = express.Router();
router.get('/', getTeachers);
router.post('/', createTeacher);

export default router;