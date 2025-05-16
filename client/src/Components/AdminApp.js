import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminAuth from './AdminAuth';
import AdminDashboard from './AdminDashboard';
import UserList from './UserList';
import AdminQuizManagement from './AdminQuizManagement';
import AdminUserScoreChart from './AdminUserScoreChar';
import Adminexport from './Adminexport';
import AdminVerificationDashboard from './AdminVerificationDashboard';

const AdminApp = () => {
    return (
        <Routes>
            <Route path="login" element={<AdminAuth isLogin={true} />} />
            <Route path="register" element={<AdminAuth />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/quizzes" element={<AdminQuizManagement />} />
            <Route path="/scores" element={<AdminUserScoreChart />} />
            <Route path="/export" element={<Adminexport />} />
            <Route path="/verification-requests" element={<AdminVerificationDashboard />} />
        </Routes>
    );
};

export default AdminApp;
