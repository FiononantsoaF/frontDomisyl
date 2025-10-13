import React, { useState } from 'react';
import { Lock, ChevronLeft } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    try {
      const payload = { token, newPassword: clientData.newPassword };
      const res = await API.post<Reset>('/change-password', payload);

      alert(res.data.message || 'Mot de passe changé avec succès.');
      navigate('/');
    } catch (error: any) {
      alert(
        'Erreur lors du changement de mot de passe : ' +
          (error?.response?.data?.message || error.message || 'Erreur inconnue')
      );
      navigate('/password_reset');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <Link
          to="/login"
          className="flex items-center text-[#f18f34] font-semibold hover:underline mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Retour
        </Link>
      </div>
      <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Lock className="text-[#f18f34]" />
          Changer le mot de passe
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              name="newPassword"
              value={clientData.newPassword}
              onChange={handleClientDataChange}
              placeholder="Nouveau mot de passe"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34] shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={clientData.confirmPassword}
              onChange={handleClientDataChange}
              placeholder="Confirmer le mot de passe"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34] shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-semibold py-3 rounded-full transition-all shadow-md ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#f9b131] to-[#f18f34] hover:from-[#f18f34] hover:to-[#f9b131]'
            }`}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
