import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import App from './App';
import Changepassword from './components/ChangePassword';
import RequestPasswordReset from './components/RequestPasswordReset';
import ProfileEdit from './components/ProfilEdit';

import CarteCadeau from './components/cartecadeau/CarteCadeauComponent';
import PaiementCarteCadeauPage from "./pages/cartecadeau/PaiementCarteCadeauPage";

import SuccessPayment from "./pages/urlpayment/SuccessPayment";
import CancelPayment from "./pages/urlpayment/CancelPayment";
import NotifPayment from "./pages/urlpayment/NotifPayment";

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },

  // reset password
  {
    path: '/password-reset/:token',
    element: <Changepassword />
  },
  {
    path: '/password_reset',
    element: <RequestPasswordReset />
  },

  // profile
  {
    path: '/profile-edit',
    element: <ProfileEdit />
  },

  // carte cadeau
  {
    path: '/carte-cadeau',
    element: <CarteCadeau />
  },
  {
    path: '/paiement-carte-cadeau',
    element: <PaiementCarteCadeauPage />
  },

  // 🔥 URLs ORANGE MONEY
  {
    path: '/success',
    element: <SuccessPayment />
  },
  {
    path: '/cancel',
    element: <CancelPayment />
  },
  {
    path: '/notif',
    element: <NotifPayment />
  },

  // redirect unknown route
  {
    path: '*',
    element: <Navigate to="/" replace />
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
