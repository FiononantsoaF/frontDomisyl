import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios'; 
import { User, servicesService } from '../api/serviceCategoryApi';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();

  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const getUser = (): User | null => {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) as User : null;
  };

  useEffect(() => {
    const res = getUser();
    const user_id = localStorage.getItem("user_id");
    if(res && user_id){
      setUserDetail(res);
      setFormData({ 
        id: user_id,
        name: res.name,
        phone: res.phone,
        email: res.email,
        address: res.address
      });
    }
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "address") {
      const valid = await servicesService.checkAdress(value);
      setAddressError(valid ? null : "L'adresse ne peut pas être uniquement des chiffres.");
    }
    if (name === "email") {
      const valid = await servicesService.checkEmailFormat(value);
      setEmailError(valid ? null : "Email invalide");
    }
    if (name === "phone") {
      const valid = await servicesService.checkPhoneNumber(value);
      setPhoneError(valid ? null : "Veuillez vérifier votre numéro !");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if(addressError || emailError || phoneError){
      alert("Veuillez corriger les erreurs avant de soumettre.");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post('/user/update', formData);
      const updatedUser: User = response.data.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert("Profil mis à jour avec succès !");
      navigate('/');
    } catch (err: any) {
      console.error(err);
      alert('Erreur lors de la mise à jour : ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!userDetail) return <p className="text-center text-gray-500 mt-10">Chargement...</p>;

  return (
    <>
      <div>
            <Link 
          to="/" 
          className="text-[#f18f34] font-semibold hover:underline mb-4 block"
        >
          ← Retour à l'accueil
        </Link>
      </div>
      <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl border border-gray-100">

        {!editing ? (
          <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUser className="text-[#f18f34]" />
            {userDetail.name}
          </h2>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-2">
              <p className="flex items-center gap-2">
                <FaPhone className="text-[#f18f34]" />
                <strong>Téléphone :</strong> {userDetail.phone}
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-[#f18f34]" />
                <strong>Email :</strong> {userDetail.email}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#f18f34]" />
                <strong>Adresse :</strong> {userDetail.address}
              </p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-4 w-full bg-gradient-to-r from-[#f9b131] to-[#f18f34] hover:from-[#f18f34] hover:to-[#f9b131] text-white px-5 py-3 rounded-full transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Modifier
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="id" value={formData.id} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34] shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34] shadow-sm"
                required
              />
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34] shadow-sm"
                required
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34] shadow-sm"
                required
              />
              {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#f9b131] to-[#f18f34] hover:from-[#f18f34] hover:to-[#f9b131] text-white px-5 py-3 rounded-full transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enregistrement...' : 'Sauvegarder'}
              </button>

              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 border border-gray-300 px-5 py-3 rounded-full text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ProfileEdit;
