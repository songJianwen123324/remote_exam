import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { message } from 'antd';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: '', // 可以在这里配置基础 URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动添加 token
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理认证错误
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 如果收到 401 错误，说明 token 已过期，自动登出
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      message.error('认证已过期，请重新登录');
      return Promise.reject(new Error('认证已过期，请重新登录'));
    }
    
    // 其他错误处理
    const errorMessage = error.response?.data?.message || 
                        error.response?.statusText || 
                        error.message || 
                        '请求失败';
    message.error(errorMessage);
    
    return Promise.reject(new Error(errorMessage));
  }
);

// 导出配置好的 axios 实例
export default apiClient;

// 导出便捷的请求方法
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
}; 