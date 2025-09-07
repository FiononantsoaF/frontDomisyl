import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, User, Award, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  client: {
    full_name: string;
    phone: string;
  };
  service: {
    name: string;
    duration: number;
  };
  practitioner: {
    full_name: string;
  };
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client:client_id(full_name, phone),
          service:service_id(name, duration),
          practitioner:practitioner_id(full_name)
        `)
        .gte('start_time', `${selectedDate}T00:00:00`)
        .lte('start_time', `${selectedDate}T23:59:59`)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-600 bg-blue-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
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
        <h1 className="text-2xl font-semibold text-gray-900">Rendez-vous</h1>
        <div className="mt-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucun rendez-vous pour cette date
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#f18f34] rounded-full p-2">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {appointment.service.name}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(appointment.start_time), 'HH:mm')} - 
                          {format(new Date(appointment.end_time), 'HH:mm')}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {appointment.client.full_name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-full"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;