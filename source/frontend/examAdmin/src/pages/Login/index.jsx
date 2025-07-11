import React, { useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import './index.scss';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const [form] = Form.useForm();

  // 如果已经登录，重定向到主页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 显示错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError]);

  // 处理登录表单提交
  const handleLogin = async (values) => {
    try {
      const result = await login(values);
      if (result.success) {
        message.success('登录成功！');
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Title level={3} className="login-title">
          考试后台管理系统
        </Title>

        <Form
          form={form}
          name="login"
          className="login-form"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: '请输入用户名！',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              loading={isLoading}
              block
              size='middle'
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
