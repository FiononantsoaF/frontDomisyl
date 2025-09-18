import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import API from '../api/axios'; 

interface PaiementStripeProps {
  amount: number;
  appointment_id: string;
  subscription_id: string;
  onSuccess?: () => void;
}

const PaiementStripe: React.FC<PaiementStripeProps> = ({
  amount,
  appointment_id,
  subscription_id,
  onSuccess
  
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [amountEuro, setAmountEuro] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await API.post('/stripe/create-payment-intent', { amount });
        setClientSecret(response.data.clientSecret);
        setAmountEuro(response.data.amountEuro);
        console.log("reponse stripe", response);
      } catch (error) {
        alert('Erreur serveur Stripe');
        console.error(error);
      }
    };

    createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!
      }
    });

    if (result.error) {
      alert('Erreur paiement : ' + result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      try {
        await API.post('/payments/confirm-stripe', {
          appointment_id,
          subscription_id,
          amount,
          method: 'stripe',
          reference: result.paymentIntent.id
        });
        alert('Paiement réussi !');
        if (onSuccess) onSuccess();
      } catch (error) {
        alert("Erreur lors de l'enregistrement du paiement.");
        console.error(error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                Paiement par Carte</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg border border-orange-100 mb-4">
                <p className="text-sm font-medium text-gray-600">Total à payer</p>
                <p className="text-2xl font-bold text-[#f18f34]">{amount} Ar (~ {amountEuro ? (amountEuro / 100).toFixed(2) : '...'} €)</p>
                </div>
                <div style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <CardElement />
                </div>
                <button type="submit" disabled={!stripe || !clientSecret || loading} 
                    className="w-full bg-gradient-to-r from-[#f9b131] to-[#f18f34] hover:from-[#f18f34] hover:to-[#f9b131] text-dark px-4 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md hover:shadow-lg"
                    style={{ marginTop: '10px' }}>
                    {loading ? 'Paiement en cours...' : 'Payer par carte'}
                </button>
            </form>
        </div>
    </div>
  );
};

export default PaiementStripe;
