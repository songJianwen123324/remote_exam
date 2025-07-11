import { api } from '../utils/apiUtils';

// 认证服务API
export const authService = {
  // 获取用户列表
  getUserList: async (params) => {
    const response = await api.get('/api/user', { params });
    return response.data;
  },

  // 创建用户
  createUser: async (data) => {
    const response = await api.post('/api/user', data);
    return response.data;
  },

  // 更新用户
  updateUser: async (id, data) => {
    const response = await api.patch(`/api/user/${id}`, data);
    return response.data;
  },

  // 删除用户
  deleteUser: async (id) => {
    const response = await api.delete(`/api/user/${id}`);
    return response.data;
  }
}; 