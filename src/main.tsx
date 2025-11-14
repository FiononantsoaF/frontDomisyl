import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider , Navigate} from 'react-router-dom';
import App from './App';
import Changepassword from './components/ChangePassword';
import RequestPasswordReset from './components/RequestPasswordReset';
import ProfileEdit from './components/ProfilEdit';
import './index.css';
import CarteCadeau from './components/cartecadeau/CarteCadeauComponent';

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
  path:'/password-reset/:token',
     element: <Changepassword/>
  },
  {
    path:'/password_reset',
    element: <RequestPasswordReset/>
  },
  {
    path:'/profile-edit',
    element: <ProfileEdit/>
  },
  {path:'/carte-cadeau',
     element: <CarteCadeau/>
  },
  
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