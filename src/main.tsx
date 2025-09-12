import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider , Navigate} from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Appointments from './pages/Appointments';
import Services from './pages/Services';
import Changepassword from './components/ChangePassword';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '*', 
    element: <Navigate to="/" replace />,
  },
  {
    path:'/password',
    element: <Changepassword/>
  }

  // {
  //   path: '/login',
  //   element: <Login />,
  // },
  // {
  //   path: '/admin',
  //   element: <DashboardLayout />,
  //   children: [
  //     {
  //       index: true,
  //       element: <Dashboard />,
  //     },
  //     {
  //       path: 'clients',
  //       element: <Clients />,
  //     },
  //     {
  //       path: 'appointments',
  //       element: <Appointments />,
  //     },
  //     {
  //       path: 'services',
  //       element: <Services />,
  //     },
  //   ],
  // },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);