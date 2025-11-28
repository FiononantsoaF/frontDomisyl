import React from "react";
import { useSearchParams } from "react-router-dom";

const SuccessPayment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const appointment_id = searchParams.get("appointment_id");
  const client_id = searchParams.get("client_id");

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-green-600">Paiement réussi 🎉</h1>

      <p className="mt-4">
        Merci ! Votre paiement pour le rendez-vous 
        <strong> {appointment_id}</strong> a été validé.
      </p>

      <a
        href="/"
        className="mt-6 inline-block bg-green-600 px-6 py-3 rounded-lg text-white"
      >
        Retour à l'accueil
      </a>
    </div>
  );
};

export default SuccessPayment;
