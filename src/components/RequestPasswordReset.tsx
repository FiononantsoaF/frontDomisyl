import React, { useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';
import { ChevronLeft, Mail } from 'lucide-react';
import { Client } from '../api/serviceCategoryApi';

export interface ResetResponse {
  success: boolean;
  message: string;
  data: Client;
}

const RequestPasswordReset: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await API.post<ResetResponse>('/password-reset-request', { identifier });
      alert(response.data.message);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        alert('Erreur : ' + err.response.data.message);
      } else {
        alert('Erreur lors de l’envoi de l’email.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>

      <div>
        <Link
          to="/"
          className="flex items-center text-[#f18f34] font-semibold hover:underline mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Retour
        </Link>
      </div>
      
      <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Mail className="text-[#f18f34]" />
          Mot de passe oublié ?
        </h2>

        <p className="text-gray-600 mb-6">
          Entrez votre adresse e-mail pour recevoir un lien vous permettant de réinitialiser votre mot de passe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="exemple@mail.com"
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
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>
      </div>
    </>
  );
};

export default RequestPasswordReset;
