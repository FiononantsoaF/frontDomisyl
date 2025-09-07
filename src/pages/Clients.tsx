import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, Mail, MapPin } from 'lucide-react';

interface Client {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f18f34]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {client.full_name}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{client.phone}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{client.email}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{client.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clients;