import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import teacherRoutes from './routes/teacherRoutes.js';
import teacherPositionRoutes from './routes/teacherPositionRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_management')
  .then(() => console.log('Kết nối MongoDB thành công!'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Routes API theo yêu cầu
app.use('/teachers', teacherRoutes);
app.use('/teacher-positions', teacherPositionRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server đang khởi chạy tại http://localhost:${PORT}`);
});