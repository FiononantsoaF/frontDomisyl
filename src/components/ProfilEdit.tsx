import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios'; 
import { User } from '../api/serviceCategoryApi';
import { servicesService } from '../api/serviceCategoryApi'; 


const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [addressError, setAddressError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const getUser = (): User | null => {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) as User : null;
    };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = getUser();
        const user_id = localStorage.getItem("user_id");
        console.log(res);
        if(!res || !user_id) {
            return;
        } else {
            setUserDetail(res);
            setFormData({ 
            id:user_id,
            name: res?.name,
            phone: res?.phone,
            email: res?.email,
            address : res?.address
            });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);


const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (name === "address") {
          const error = await servicesService.checkAdress(value);
            if (!error) {
              setAddressError("L'adresse ne pas être uniquement des chiffres.");
            } else {
              setAddressError(null);
            }
      }
      if(name === "email"){
        const erreuremail = await servicesService.checkEmailFormat(value);
        if(!erreuremail){
            setEmailError("Email invalide ");
        } else {
            setEmailError(null);
        }
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if(addressError != null){
      alert("Veuillez saisir une adresse valide");
      return;
    }
    
    if(emailError != null) {
        alert("Veuillez saisir un email valide");
        return;
    }
    try {
       const user = await API.post('/user/update', formData);
       console.log(user);
        alert('Profil mis à jour avec succès !');

        navigate('/');

        // localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err: any) {
      console.error(err);
      alert('Erreur lors de la mise à jour : ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!userDetail) return <p>Chargement...</p>;
  return (
    <>
          <div>
            <Link 
              to="/login" 
              className="text-[#f18f34] font-semibold hover:underline"
            >
              ← Retour à l'accueil
            </Link>
          </div>
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Modifier le profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="hidden"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            required
          />
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
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
          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
            required
          />
            {addressError && (
            <p className="text-red-500 text-sm mt-1">{addressError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#f18f34] hover:bg-[#f9b131] text-white px-4 py-2 rounded-full transition-colors"
        >
          {loading ? 'Enregistrement...' : 'Sauvegarder'}
        </button>
      </form>
    </div>
    </>
  );
};

export default ProfileEdit;
