import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, DollarSign, Plus, Edit2, Trash2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    category: 'massage'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', editingService.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        duration: 60,
        price: 0,
        category: 'massage'
      });
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      category: service.category
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
    
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
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
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
        <button
          onClick={() => {
            setEditingService(null);
            setFormData({
              name: '',
              description: '',
              duration: 60,
              price: 0,
              category: 'massage'
            });
            setIsModalOpen(true);
          }}
          className="bg-[#f18f34] hover:bg-[#f9b131] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Ajouter un service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <p className="mt-2 text-sm text-gray-600">{service.description}</p>
            
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {service.duration} min
              </div>
              <div className="flex items-center text-gray-500">
                <DollarSign className="h-4 w-4 mr-1" />
                {service.price.toLocaleString()} Ar
              </div>
            </div>
            
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {service.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingService ? 'Modifier le service' : 'Ajouter un service'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="15"
                  step="15"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (Ar)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
                  required
                >
                  <option value="massage">Massage</option>
                  <option value="sport">Sport</option>
                  <option value="beauty">Beauté</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#f18f34] hover:bg-[#f9b131] rounded-md"
                >
                  {editingService ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Services;