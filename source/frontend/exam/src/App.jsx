import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useLanguageStore } from './stores/languageStore';
import './i18n/config'; // 初始化 i18n
import './App.css';

function App() {
  const { initializeLanguage } = useLanguageStore();

  useEffect(() => {
    // 初始化语言设置
    initializeLanguage();
  }, [initializeLanguage]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
