import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import './index.scss';
import loginRight from '@/assets/login/loginRight.png';
import loginArrow from '@/assets/login/login-arrow.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, clearError } = useAuthStore();
  const [form, setForm] = useState({
    account_name: '',
    account_pwd: ''
  });

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submit = async () => {
    if (!form.account_name || !form.account_pwd) {
      message.error(t('validation.required'));
      return;
    }

    clearError();
    
    const result = await login({
      username: form.account_name,
      password: form.account_pwd,
    });

    if (result.success) {
      message.success(t('auth.loginSuccess'));
      navigate('/');
    } else {
      message.error(result.error || t('auth.loginFailed'));
    }
  };

  return (
    <div className="login-page">
      <div className="rightView"></div>
      <img className="loginBackImg" src={loginRight} alt="login background" />
      
      {/* 语言切换器 */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
        <LanguageSwitcher style={{ color: 'white' }} />
      </div>
      
      <div className="login-container">
        <div className="login-title-big">{t('common.remote_exam')}</div>
        <div className="login-title login-title-margin">{t('common.username')}</div>
        <input 
          className="login-input" 
          value={form.account_name}
          onChange={(e) => handleInputChange('account_name', e.target.value)}
          placeholder={t('auth.usernameRequired')}
        />
        
        <div className="login-title login-title-margin">{t('common.password')}</div>
        <div className="code-input-container">
          <input 
            className="login-input" 
            type="password" 
            value={form.account_pwd}
            onChange={(e) => handleInputChange('account_pwd', e.target.value)}
            placeholder={t('auth.passwordRequired')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submit();
              }
            }}
          />
        </div>
        <div className="submit-container">
          <div className="submit-arrow-container">
            <img 
              onClick={submit} 
              src={loginArrow} 
              className="submit-arrow"
              alt={t('auth.login')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  submit();
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;