import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Avatar, Dropdown, Space, Typography } from 'antd';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import './index.scss';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 处理退出登录
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // 处理主菜单点击事件
  const handleMenuClick = ({ key }) => {
    const menuItem = menuItems.find(item => item.key === key);
    if (menuItem && menuItem.path) {
      navigate(menuItem.path);
    }
  };

  // 处理用户下拉菜单点击事件
  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case 'logout':
        handleLogout();
        break;
      case 'profile':
        // 跳转到个人信息页面
        console.log('跳转到个人信息');
        break;
      case 'settings':
        // 跳转到设置页面
        console.log('跳转到设置');
        break;
      default:
        break;
    }
  };

  // 根据当前路径获取选中的菜单key
  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    const selectedItem = menuItems.find(item => item.path === currentPath);
    return selectedItem ? [selectedItem.key] : ['1']; // 默认选中第一个
  };

  // 用户下拉菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  // 用户信息显示组件
  const UserInfo = () => (
    <Space>
      <Avatar 
        size="small" 
        icon={<UserOutlined />} 
        src={user?.avatar}
        style={{ backgroundColor: '#1890ff' }}
      />
      <Text style={{ color: '#000', fontSize: '14px' }}>
        {user?.name || user?.username || '管理员'}
      </Text>
    </Space>
  );

  const menuItems = [
    {
      key: '1',
      icon: <UploadOutlined />,
      label: '首页',
      path: '/',
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: '用户管理',
      path: '/user',
    },
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header 
          style={{ 
            padding: '0 24px 0 0', 
            background: colorBgContainer,
            height: 50,
            lineHeight: '50px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 50,
              height: 50,
            }}
          />
          
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
            trigger={['hover']}
          >
            <div className="user-info-container">
              <UserInfo />
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            height: '100%',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;