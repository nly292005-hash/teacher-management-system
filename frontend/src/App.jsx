import React from 'react';
import { Layout, Tabs, Typography } from 'antd';
import { UserOutlined, AppstoreOutlined } from '@ant-design/icons';
import TeacherList from './components/TeacherList';
import TeacherPositionList from './components/TeacherPositionList';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App = () => {
  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined />
          Quản lý Giáo viên
        </span>
      ),
      children: <TeacherList />,
    },
    {
      key: '2',
      label: (
        <span>
          <AppstoreOutlined />
          Vị trí công tác
        </span>
      ),
      children: <TeacherPositionList />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#001529', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          Hệ Thống Quản Lý Giáo Viên
        </Title>
      </Header>

      <Content style={{ padding: '24px 40px' }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, minHeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <Tabs defaultActiveKey="1" items={tabItems} size="large" />
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', color: '#8c8c8c' }}>
        Teacher Management System ©2026 - MERN Stack Project
      </Footer>
    </Layout>
  );
};

export default App;