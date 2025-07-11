import React from 'react';
import { Select, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores/languageStore';

const { Option } = Select;

const LanguageSwitcher = ({ style, size = 'middle' }) => {
  const { t } = useTranslation();
  const { 
    currentLanguage, 
    supportedLanguages, 
    changeLanguage, 
    isLoading 
  } = useLanguageStore();

  const handleLanguageChange = (value) => {
    changeLanguage(value);
  };

  return (
    <Space style={style}>
      <GlobalOutlined/>
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        loading={isLoading}
        size={size}
        style={{ minWidth: 120 }}
        placeholder={t('common.language')}
      >
        {supportedLanguages.map(lang => (
          <Option key={lang.code} value={lang.code}>
            <Space>
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </Space>
          </Option>
        ))}
      </Select>
    </Space>
  );
};

export default LanguageSwitcher; 