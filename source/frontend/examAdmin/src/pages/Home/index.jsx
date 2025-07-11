import React from 'react';
import './index.scss';

const HomePage = () => {
  return (  
    <div className="home-page">
      <div className="page-header">
        <h1>欢迎使用考试管理系统</h1>
        <p>在这里您可以管理考试、题库、用户和查看统计报表</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <h3>1,247</h3>
            <p>用户总数</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>86</h3>
            <p>试卷模板</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>125</h3>
            <p>考试场次</p>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>快速操作</h2>
        <div className="action-grid">
          <button className="action-btn">
            <span className="action-icon">👤</span>
            <span>用户管理</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📋</span>
            <span>创建模板</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📝</span>
            <span>创建考试</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage;