import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Drawer, Form, Input, Select, DatePicker, message, Space } from 'antd';
import axios from 'axios';

const API_BASE = 'http://localhost:8080';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form] = Form.useForm();

  // Load danh sách Giáo viên
  const fetchTeachers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/teachers?page=${page}&limit=${limit}`);
      setTeachers(res.data.data || []);
      setPagination({
        current: res.data.page || page,
        pageSize: res.data.limit || limit,
        total: res.data.total || 0
      });
    } catch (err) {
      message.error('Không thể tải danh sách giáo viên');
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách Vị trí công tác
  const fetchPositions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/teacher-positions`);
      setPositions(res.data.data || []);
    } catch (err) {
      message.error('Không thể tải vị trí công tác');
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchPositions();
  }, []);

  // Submit tạo mới Giáo viên
  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
      };
      await axios.post(`${API_BASE}/teachers`, payload);
      message.success('Tạo mới giáo viên thành công!');
      setOpenDrawer(false);
      form.resetFields();
      fetchTeachers(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const columns = [
    { 
      title: 'Mã GV', 
      dataIndex: 'code', 
      key: 'code',
      render: (code) => code || 'N/A'
    },
    {
      title: 'Giáo viên',
      key: 'user',
      render: (_, record) => {
        const name = record.name || record.userId?.name || 'N/A';
        const email = record.email || record.userId?.email || '';
        const phone = record.phoneNumber || record.userId?.phoneNumber || '';
        return (
          <div>
            <strong>{name}</strong>
            {email && <div><small>{email}</small></div>}
            {phone && <div><small>{phone}</small></div>}
          </div>
        );
      }
    },
    {
      title: 'Trình độ (cao nhất)',
      key: 'degrees',
      render: (_, record) => {
        const topDegree = record.degrees?.[0];
        if (!topDegree) return 'N/A';
        
        const degreeName = topDegree.degree || topDegree.type || topDegree.level || '';
        const schoolName = topDegree.school || topDegree.major || '';
        
        if (!degreeName && !schoolName) return 'N/A';
        return schoolName ? `${degreeName} - ${schoolName}` : degreeName;
      }
    },
    {
      title: 'TT Công tác',
      key: 'positions',
      render: (_, record) => (
        <Space wrap>
          {record.teacherPositions && record.teacherPositions.length > 0 ? (
            record.teacherPositions.map(p => (
              <Tag color="blue" key={p._id || p}>{p.name || p}</Tag>
            ))
          ) : (
            'N/A'
          )}
        </Space>
      )
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      render: (_, record) => record.address || record.userId?.address || 'N/A'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => {
        const active = isActive !== false;
        return (
          <Tag color={active ? 'green' : 'red'}>
            {active ? 'Đang công tác' : 'Ngừng công tác'}
          </Tag>
        );
      }
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Danh sách Giáo viên</h2>
        <Button type="primary" onClick={() => setOpenDrawer(true)}>+ Tạo mới</Button>
      </div>

      <Table
        rowKey={(record) => record._id || record.code || Math.random()}
        columns={columns}
        dataSource={teachers}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => fetchTeachers(page, pageSize)
        }}
      />

      {/* Drawer Tạo mới Giáo viên */}
      <Drawer
        title="Tạo thông tin giáo viên"
        width={600}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email hợp lệ' }]}>
            <Input placeholder="example@school.edu.vn" />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Số điện thoại">
            <Input placeholder="0975xxxxxx" />
          </Form.Item>
          <Form.Item name="identity" label="Số CCCD">
            <Input placeholder="Nhập số CCCD" />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Địa chỉ thường trú" />
          </Form.Item>
          <Form.Item name="dob" label="Ngày sinh">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="teacherPositions" label="Vị trí công tác">
            <Select mode="multiple" placeholder="Chọn vị trí công tác">
              {positions.map(p => (
                <Select.Option key={p._id} value={p._id}>{p.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Lưu thông tin</Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default TeacherList;