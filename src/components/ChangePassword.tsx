import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import API from '../api/axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Client } from '../api/serviceCategoryApi';

export interface Reset {
  success: boolean;
  message: string;
  data: Client;
}

interface PasswordData {
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<PasswordData>({
    newPassword: '',
    confirmPassword: '',
  });

  const handleClientDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clientData.newPassword !== clientData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const payload = {
        token: token,
        newPassword: clientData.newPassword
      };
      console.log(payload);
      const res = await API.post<Reset>(`/change-password`, payload);
      console.log('Mot de passe changé avec succès', res.data);
      alert(res.data.message || 'Mot de passe changé avec succès.');
      navigate('/'); 

    } catch (error: any) {
      console.error('Password change failed:', error);
      alert('Erreur lors du changement de mot de passe : ' + 
        (error?.response?.data?.message || error.message || 'Erreur inconnue'));
      navigate('/password_reset');
    }
  };

  return (
    <>
      <div>
        <Link 
          to="/login" 
          className="text-[#f18f34] font-semibold hover:underline"
        >
          ← Retour à l'accueil
        </Link>
      </div>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">
            🔐 Changer le mot de passe
          </h2>

          <form 
            onSubmit={handleChangePassword} 
            className="grid grid-cols-1 gap-6"
          >
            {/* Nouveau mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                name="newPassword"
                value={clientData.newPassword}
                onChange={handleClientDataChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
                required
              />
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={clientData.confirmPassword}
                onChange={handleClientDataChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
                required
              />
            </div>

            {/* Bouton */}
            <div>
              <button
                type="submit"
                className="w-full bg-[#f9b131] hover:bg-[#f18f34] text-white px-4 py-3 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Agency FB, sans-serif' }}
              >
                <Lock className="w-5 h-5" />
                Changer le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
