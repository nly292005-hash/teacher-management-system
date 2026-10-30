import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Drawer, Form, Input, Radio, message } from 'antd';
import axios from 'axios';

const API_BASE = 'http://localhost:8080';

const TeacherPositionList = () => {
  const [positions, setPositions] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form] = Form.useForm();

  const fetchPositions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/teacher-positions`);
      setPositions(res.data.data);
    } catch (err) {
      message.error('Không thể tải danh sách vị trí công tác');
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSubmit = async (values) => {
    try {
      await axios.post(`${API_BASE}/teacher-positions`, values);
      message.success('Tạo vị trí công tác thành công!');
      setOpenDrawer(false);
      form.resetFields();
      fetchPositions();
    } catch (err) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const columns = [
    { title: 'STT', render: (_, __, index) => index + 1 },
    { title: 'Mã', dataIndex: 'code', key: 'code' },
    { title: 'Tên vị trí', dataIndex: 'name', key: 'name' },
    { title: 'Mô tả', dataIndex: 'des', key: 'des' },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng'}
        </Tag>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Vị trí công tác</h2>
        <Button type="primary" onClick={() => setOpenDrawer(true)}>+ Tạo mới</Button>
      </div>

      <Table rowKey="_id" columns={columns} dataSource={positions} pagination={false} />

      <Drawer
        title="Tạo mới Vị trí công tác"
        width={450}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ isActive: true }}>
          <Form.Item name="code" label="Mã vị trí" rules={[{ required: true, message: 'Nhập mã vị trí' }]}>
            <Input placeholder="Ví dụ: GVBM, HT, HP..." />
          </Form.Item>
          <Form.Item name="name" label="Tên vị trí" rules={[{ required: true, message: 'Nhập tên vị trí' }]}>
            <Input placeholder="Ví dụ: Giáo viên bộ môn" />
          </Form.Item>
          <Form.Item name="des" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết công việc..." />
          </Form.Item>
          <Form.Item name="isActive" label="Trạng thái">
            <Radio.Group>
              <Radio value={true}>Hoạt động</Radio>
              <Radio value={false}>Ngừng</Radio>
            </Radio.Group>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Lưu vị trí</Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default TeacherPositionList;