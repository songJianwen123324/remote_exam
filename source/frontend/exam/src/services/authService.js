import { api } from '@/utils/apiUtils';

// 认证服务API
export const authService = {
  // 用户登录
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  // 用户登出
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  // 获取用户信息
  getUserProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  }
}; 