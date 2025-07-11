import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 导入语言资源
import zhTranslation from './locales/zh.json'
import enTranslation from './locales/en.json'

// 语言资源配置
const resources = {
  zh: {
    translation: zhTranslation
  },
  en: {
    translation: enTranslation
  }
}

i18n
  // 使用语言检测器
  .use(LanguageDetector)
  // 传递 i18n 实例给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    resources,
    
    // 默认语言
    lng: 'zh',
    
    // 回退语言
    fallbackLng: 'zh',
    
    // 语言检测选项
    detection: {
      // 检测顺序
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // 缓存用户语言
      caches: ['localStorage'],
      
      // 排除某些语言检测
      excludeCacheFor: ['cimode'],
    },

    // 调试模式（开发环境）
    debug: import.meta.env.DEV,

    // 插值选项
    interpolation: {
      // 不需要转义，React 已经处理了
      escapeValue: false,
    },

    // 默认命名空间
    defaultNS: 'translation',
    
    // 命名空间分隔符
    nsSeparator: ':',
    
    // 键分隔符
    keySeparator: '.',
    
    // 返回对象而不是字符串
    returnObjects: false,
    
    // 返回详细信息
    returnDetails: false,
    
    // 在缺少键时返回键名
    returnEmptyString: false,
    
    // 后处理器
    postProcess: false,
    
    // 支持的语言列表
    supportedLngs: ['zh', 'en'],
    
    // 非显式支持的语言检查
    nonExplicitSupportedLngs: false,
    
    // 清理代码
    cleanCode: true,
  })

export default i18n 