
import React, { useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const RequestPasswordReset: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();
    try {
      await API.post('/password-reset-request', { identifier });
      alert('Email envoyé ! Vérifiez votre boîte de réception.');

    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’envoi de l’email.');

    } finally{
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
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email"
          className="w-full mb-4 border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting} 
          className="w-full bg-[#f9b131] hover:bg-[#f18f34] text-white px-4 py-2 rounded"
        >
          Envoyer le lien
        </button>
      </form>
    </div>
    </>
  );
};

export default RequestPasswordReset;
