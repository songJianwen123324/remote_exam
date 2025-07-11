import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import UserManage from './pages/UserManage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="user" element={<UserManage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
