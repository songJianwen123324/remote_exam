import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@/i18n/config'

// 支持的语言列表
const SUPPORTED_LANGUAGES = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

// 创建语言状态管理 store
export const useLanguageStore = create(
  persist(
    (set, get) => ({
      // 状态
      currentLanguage: 'en', // 默认英文
      supportedLanguages: SUPPORTED_LANGUAGES,
      isLoading: false,

      // 切换语言
      changeLanguage: async (languageCode) => {
        const { supportedLanguages } = get()
        
        // 检查语言是否支持
        const isSupported = supportedLanguages.some(lang => lang.code === languageCode)
        if (!isSupported) {
          console.error(`Language ${languageCode} is not supported`)
          return false
        }

        set({ isLoading: true })
        
        try {
          // 更新 i18n 语言
          await i18n.changeLanguage(languageCode)
          
          set({
            currentLanguage: languageCode,
            isLoading: false
          })
          
          return true
        } catch (error) {
          console.error('Failed to change language:', error)
          set({ isLoading: false })
          return false
        }
      },

      // 获取当前语言信息
      getCurrentLanguageInfo: () => {
        const { currentLanguage, supportedLanguages } = get()
        return supportedLanguages.find(lang => lang.code === currentLanguage)
      },

      // 获取语言显示名称
      getLanguageName: (code) => {
        const { supportedLanguages } = get()
        const language = supportedLanguages.find(lang => lang.code === code)
        return language ? language.name : code
      },

      // 初始化语言
      initializeLanguage: async () => {
        const { currentLanguage } = get()
        try {
          await i18n.changeLanguage(currentLanguage)
          return true
        } catch (error) {
          console.error('Failed to initialize language:', error)
          return false
        }
      }
    }),
    {
      name: 'language-storage', // 本地存储的键名
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
      }), // 只持久化当前语言
    }
  )
) 