import Teacher from '../models/Teacher.js';
import User from '../models/User.js';

// Hàm sinh mã định danh 10 chữ số ngẫu nhiên & duy nhất
const generateTeacherCode = async () => {
  let code = '';
  let isUnique = false;
  while (!isUnique) {
    code = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const existing = await Teacher.findOne({ code });
    if (!existing) isUnique = true;
  }
  return code;
};

// 1. GET /teachers - Lấy danh sách giáo viên (có phân trang)
export const getTeachers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Teacher.countDocuments({ isDeleted: false });
    const teachers = await Teacher.find({ isDeleted: false })
      .populate('userId', 'name email phoneNumber address identity dob role')
      .populate('teacherPositions', 'name code des isActive')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      data: teachers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. POST /teachers - Tạo mới thông tin giáo viên
export const createTeacher = async (req, res) => {
  try {
    const {
      name, email, phoneNumber, address, identity, dob,
      teacherPositions, degrees, startDate, endDate
    } = req.body;

    // Kiểm tra email duy nhất
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại trên hệ thống!' });
    }

    // Tạo User
    const newUser = await User.create({
      name, email, phoneNumber, address, identity, dob, role: 'TEACHER'
    });

    // Sinh mã ngẫu nhiên 10 số
    const code = await generateTeacherCode();

    // Tạo Teacher
    const newTeacher = await Teacher.create({
      userId: newUser._id,
      code,
      teacherPositions: teacherPositions || [],
      degrees: degrees || [],
      startDate: startDate || new Date(),
      endDate
    });

    const populatedData = await Teacher.findById(newTeacher._id)
      .populate('userId')
      .populate('teacherPositions');

    res.status(201).json({
      success: true,
      message: 'Tạo giáo viên thành công!',
      data: populatedData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};