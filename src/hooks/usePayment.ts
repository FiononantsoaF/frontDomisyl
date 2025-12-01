
import { useState } from 'react';
import { servicesService } from '../api/serviceCategoryApi';
import type { Paiement, ValidateResponsePaiement, PaymentStatus } from '../api/serviceCategoryApi';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const initiatePayment = async (payload: Paiement): Promise<ValidateResponsePaiement> => {
    setIsLoading(true);
    setError(null);
    setPaymentStatus('pending');

    try {
      const response = await servicesService.pay(payload);

      if (response.success && response.data) {
        setReference(response.data.reference);
        setPaymentStatus('pending');
        return response;
      } else {
        setError(response.message || 'Erreur lors de l\'initiation du paiement');
        setPaymentStatus('failed');
        return response;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      setPaymentStatus('failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async (paymentReference: string) => {
    setPaymentStatus('checking');
    try {
      const statusResponse = await servicesService.checkStatus(paymentReference);
      
      if (statusResponse.success && statusResponse.data) {
        setPaymentStatus(statusResponse.data.status);
        return statusResponse.data;
      } else {
        setError('Impossible de vérifier le statut du paiement');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la vérification du statut');
      return null;
    }
  };

  const waitForPaymentConfirmation = async (
    paymentReference: string,
    maxWaitTime: number = 300000
  ) => {
    setPaymentStatus('checking');

    try {
      const statusResponse = await servicesService.pollStatus(
          paymentReference,
          Math.floor(maxWaitTime / 5000), 
        );

      if (statusResponse.data) {
        setPaymentStatus(statusResponse.data.status);
        return statusResponse.data;
      }
    } catch (err: any) {
      setError(err.message || 'Délai d\'attente dépassé');
      setPaymentStatus('failed');
      throw err;
    }
  };

  const reset = () => {
    setIsLoading(false);
    setPaymentStatus('pending');
    setError(null);
    setReference(null);
  };

  return {
    isLoading,
    paymentStatus,
    error,
    reference,
    initiatePayment,
    checkPaymentStatus,
    waitForPaymentConfirmation,
    reset,
  };
};