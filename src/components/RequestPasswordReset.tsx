import React, { useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';
import { Client, servicesService } from '../api/serviceCategoryApi';


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
      console.log(response.data); 
      alert(response.data.message); 
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
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
          className="text-[#f18f34] font-semibold hover:underline"
        >
          ← Retour à l'accueil
        </Link>
      </div>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Mot de passe oublié ?</h2>
          <p className="mb-4 text-gray-600">
            Entrez votre adresse e-mail pour recevoir un lien vous permettant de réinitialiser votre mot de passe.
          </p>
          <input
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email"
            className="w-full mb-4 border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting} 
            className={`w-full px-4 py-2 rounded text-white transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#f9b131] hover:bg-[#f18f34]'
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
