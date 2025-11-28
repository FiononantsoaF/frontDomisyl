import React, { useState } from "react";
import API from "../api/axios";

interface OrangeMoneyPaymentProps {
  amount: number;
  client_id: number;
  subscription_id: number | null;
  appointment_id: number | null;
}


const OrangeMoney: React.FC<OrangeMoneyPaymentProps> = ({  
  amount, 
  client_id, 
  subscription_id,
  appointment_id }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (amount <= 0) {
      setError("Veuillez entrer un montant valide.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/orangemoney/pocess-payment", {
        amount,
        client_id,
        subscription_id,
        appointment_id});
      if (response.data.payment_url) {
           window.location.href = response.data.payment_url;
      } else {
          setError("Impossible de récupérer l'URL de paiement.");
      }
    } catch (err: any) {
        console.error(err);
        setError("Erreur lors de la connexion à l'API.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-md mx-auto">
    <h2 className="text-xl font-bold text-blue-600 mb-4">
      Paiement Orange Money
    </h2>

    <p className="mb-3">Montant à payer : {amount} Ar</p>

    <button
      onClick={handlePay}
      disabled={loading}
      className={`w-full py-2 rounded-lg font-semibold text-white ${
        loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
      }`}
    >
      {loading ? "Redirection..." : "Payer avec Orange Money"}
    </button>

    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
  </div>

  );
};

export default OrangeMoney;
