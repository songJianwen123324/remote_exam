import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'

// 创建认证状态管理 store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 状态
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 登录操作
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const result = await authService.login(credentials)
          
          set({
            token: result.access_token,
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          return { success: true, data: result }
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          })
          return { success: false, error: error.message }
        }
      },

      // 登出操作
      logout: async () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      // 更新用户信息
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }))
      },

      // 设置 token
      setToken: (token) => {
        set({ token, isAuthenticated: !!token })
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },

      // 检查认证状态
      checkAuth: () => {
        const { token } = get()
        return !!token
      },

      // 获取带有 token 的请求头
      getAuthHeaders: () => {
        const { token } = get()
        return token ? { Authorization: `Bearer ${token}` } : {}
      },

      // 刷新用户信息
      refreshUserInfo: async () => {
        const { token } = get()
        if (!token) return

        try {
          const userInfo = await authService.getUserProfile(token)
          set((state) => ({
            user: { ...state.user, ...userInfo }
          }))
        } catch (error) {
          console.error('Failed to refresh user info:', error)
        }
      },
    }),
    {
      name: 'auth-storage', // 本地存储的键名
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // 只持久化这些字段
    }
  )
) 