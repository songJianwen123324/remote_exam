import React from 'react';
import { Card, Button, Avatar, Typography, Space, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    message.success(t('auth.logoutSuccess'));
    navigate('/login');
  };

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh'
    }}>
      {/* 语言切换器 */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
        <LanguageSwitcher />
      </div>
      
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Card 
          title={t('common.profile')} 
          extra={
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              {t('common.logout')}
            </Button>
          }
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar 
              size={64} 
              icon={<UserOutlined />} 
              src={user?.avatar}
            />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {user?.name || user?.username}
              </Title>
              <Space direction="vertical" size={4}>
                <Text type="secondary">{t('common.username')}: {user?.username}</Text>
                <Text type="secondary">{t('common.email')}: {user?.email}</Text>
                <Text type="secondary">{t('common.role', { defaultValue: '角色' })}: {user?.role}</Text>
                <Text type="secondary">{t('common.userId', { defaultValue: '用户ID' })}: {user?.id}</Text>
              </Space>
            </div>
          </div>
        </Card>

        <Card 
          title={t('home.quickActions')} 
          style={{ marginTop: 24 }}
        >
          <Space wrap>
            <Button type="primary">{t('common.module', { defaultValue: '功能模块' })} 1</Button>
            <Button>{t('common.module', { defaultValue: '功能模块' })} 2</Button>
            <Button>{t('common.module', { defaultValue: '功能模块' })} 3</Button>
            <Button>{t('common.settings')}</Button>
          </Space>
        </Card>

        <Card 
          title={t('home.recentActivity')} 
          style={{ marginTop: 24 }}
        >
          <Text type="secondary">{t('common.noData', { defaultValue: '暂无活动记录' })}</Text>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;