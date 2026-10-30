import TeacherPosition from '../models/TeacherPosition.js';

// 1. GET /teacher-positions - Danh sách vị trí công tác
export const getTeacherPositions = async (req, res) => {
  try {
    const positions = await TeacherPosition.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: positions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. POST /teacher-positions - Tạo mới vị trí công tác (mã code duy nhất)
export const createTeacherPosition = async (req, res) => {
  try {
    const { name, code, des, isActive = true } = req.body;

    const existingCode = await TeacherPosition.findOne({ code });
    if (existingCode) {
      return res.status(400).json({ success: false, message: 'Mã vị trí công tác đã tồn tại!' });
    }

    const newPosition = await TeacherPosition.create({ name, code, des, isActive });
    res.status(201).json({
      success: true,
      message: 'Tạo vị trí công tác thành công!',
      data: newPosition
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};