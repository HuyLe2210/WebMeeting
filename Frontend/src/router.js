// src/router.js
import React from 'react';
import { Navigate } from 'react-router-dom';

import AuthLayout from './layouts/error/AuthLayout';
import ErrorLayout from './layouts/error/ErrorLayout';
import DashboardLayout from './layouts/error/DashboardLayout';
import SelectLayout from './layouts/error/SelectLayout';

import LoginFormPage from './layouts/auth/LoginFormPage';
import ChangeFirstPassword from './layouts/auth/ChangeFirstPassword';
import ForgotPassword from './layouts/auth/ForgotPassword';
import ChangePassword from './layouts/auth/ChangePassword';

import Error404 from './layouts/error/Error404';
import M0101 from './containers/M0101';
import DashboardExp from './layouts/dashboard/DashboardExp';
import DashboardTc from './layouts/dashboard/DashboardTc';
import DashboardScl from './layouts/dashboard/DashboardScl';
import DashboardRes from './layouts/dashboard/DashboardRes';

import UserManagementPage from './containers/user/ListUser';
import AddUserPage from './containers/user/AddUser';

import RegisterUser from './containers/Res01/index';
import RegisterCamera from './containers/Res02/index';
import BackendCamera from './containers/Res03/index';

import MeetingJoin from './containers/ZG01/index';
import MeetingRoom from './containers/ZG02/index';
import MeetingTest from './containers/Meet01/index';
import MeetingPage from './containers/Meet02/index';

const routes = [
  {
    path: '/',
    element: <Navigate to="/main" />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginFormPage /> },
      { path: 'changePassword', element: <ChangeFirstPassword /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'forgot-password/:token', element: <ChangePassword /> },
      { path: '*', element: <Navigate to="/errors/error-404" /> },
    ],
  },
  {
    path: '/errors',
    element: <ErrorLayout />,
    children: [
      { path: 'error-404', element: <Error404 /> },
      { path: '*', element: <Navigate to="/errors/error-404" /> },
    ],
  },
  {
    path: '/main',
    element: <M0101 />,
    children: [
      { path: 'test', index: true, element: <SelectLayout /> },
    ],
  },
  {
    path: '/',    
    children: [
      { path: 'exp/dashboard', element: <DashboardExp /> },
      { path: 'tc/dashboard', element: <DashboardTc /> },
      { path: 'dtk/dashboard', element: <DashboardScl /> },
      { path: 'dtcs/dashboard', element: <DashboardRes /> },

      { path: 'admin/account/list', element: <UserManagementPage /> },
      { path: 'admin/account/list/add', element: <AddUserPage /> },
      { path: 'admin/account/list/edit/:id', element: <AddUserPage /> },

      // User management
      { path: 'registeruser', element: <RegisterUser /> },
      { path: 'registeruser/camera', element: <RegisterCamera /> },
      { path: '/backend/camera', element: <BackendCamera /> },

      { path: 'meeting/join', element: <MeetingJoin /> },
      { path: 'meeting/room', element: <MeetingRoom /> },

      { path: 'meeting/test', element: <MeetingTest /> },
      { path: 'meeting/page', element: <MeetingPage /> },
      // Fallback
      // { path: '*', element: <Navigate to="/errors/error-404" /> },
    ],
  },
];

export default routes;
