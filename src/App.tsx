import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, isSameDay, min } from "date-fns";
import { Calendar, Heart, Users, MessageSquare, Award, X, ChevronLeft, Clock, MapPin, Check, Mail, Phone, CreditCard } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import { AllAppointments, Login, servicesService } from './api/serviceCategoryApi'; 
import { Services } from './api/serviceCategoryApi';
import { ServiceType } from './api/serviceCategoryApi';
import { Employee } from './api/serviceCategoryApi';
import { BookingPayload } from './api/serviceCategoryApi';
import { SubscriptionList } from './api/serviceCategoryApi';
import { AppointmentList} from './api/serviceCategoryApi';
import { EmployeeCreneau } from './api/serviceCategoryApi';
import { Subscription } from './api/serviceCategoryApi';
import { PaiementData } from './api/serviceCategoryApi';
import { User} from './api/serviceCategoryApi';
import { Paiement} from './api/serviceCategoryApi';
import { useNavigate } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import PaiementStripe from './components/PaiementStripe';
import AppointmentsTable from './components/AppointmentsTable';
import { Tag, Sparkles } from "lucide-react";
import { ResponseVerification, BookingVerification, CrenVerification } from './api/serviceCategoryApi';

const stripePromise = loadStripe('pk_test_51RmAH4PMG09tDqBqfeJKApH3F1NgBd6W7QWY0rZYBgPfqMPNVeocv9FLUYa9ErmbDx666zmtnBuGKE49c8mv7gh300sdjbSwdF');

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedMassageType, setSelectedMassageType] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [showSportDetails, setShowSportDetails] = useState(false);
  const [selectedShowService, setSelectedShowService] = useState('');
  const [showServices, setShowServices] = useState(false);
  const [showList, setShowList] = useState<boolean>(() => {
  const savedShowList = localStorage.getItem('showList');
    return savedShowList ? JSON.parse(savedShowList) : false;
  });
  const [addressError, setAddressError] = useState<string | null>(null);
  const [showCareDetails, setShowCareDetails] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [availableCreneaux, setAvailableCreneaux] = useState<CrenVerification[]>([]);

  const fetchCreneaux = async (employeeId: string, date: Date) => {
    if (!employeeId || !date) return;
    const payload: BookingVerification = {
      employee_id: employeeId,
      start_times: date.toLocaleDateString('en-CA'),
    };
    try {
      const response: ResponseVerification = await servicesService.verificationcreneau(payload);
      if (response.success && response.data.prestataires[0]) {
        const creneauxMapped: CrenVerification[] = response.data.prestataires[0].creneaux_det.map(c => ({
          id: c.id,
          time: c.time,
          is_taken: c.is_taken,
        }));
        setAvailableCreneaux(creneauxMapped);
      } else {
        setAvailableCreneaux([]);
      }
    } catch (error) {
      setAvailableCreneaux([]);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password:'',
    confirmPassword:'',
    notes: ''
  });
  const [clientData, setClientData] = useState({
    login: '',
    password: ''
  });

  const [paiementData, setPaiementData] = useState({
    amount: '',
    price:'',
    client_phone: '',
    subscription_id:'',
    appointment_id: '',
    minimun:''
  });

  const [userDetail, setuserDetail] = useState<User | null>();
  const [services, setServices] = useState<Services[]>([]);
  const [employees, setEmployee] = useState<Employee[]>([]);
  const [logo, setLogo] = useState<string | null>(null);
  const [back, setBack] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ServiceType | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentList>();
  const [subscriptions, setSubscriptions] = useState<SubscriptionList>();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [appointmentsAll, setAppointmentsall] = useState<AllAppointments[]>([]);
  const [disabledDates, setIsDisabled] = useState<Date[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [selectedCreneauId, setSelectedCreneauId] = useState<number | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
  const [fromSubscription, setFromSubscription] = useState(false);
  const [paiement, setPaiement] = useState<PaiementData | null>(null);
  const [isPaiementOpen, setIsPaiementOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingpay, setLoadingpay] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [showPaymentChoice, setShowPaymentChoice] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'mvola' | 'stripe' | null>(null);

  useEffect(() => {
    if (selectedProviderId && selectedDate) {

      console.log("ettoo verification",selectedProviderId);
      console.log("ettoo verification",selectedDate);
      fetchCreneaux(selectedProviderId, selectedDate);
      setSelectedCreneauId(null); 
    }
  }, [selectedProviderId, selectedDate]);

  useEffect(() => {
    localStorage.setItem('showList', JSON.stringify(showList));
  }, [showList]);

  useEffect(() => {
  if (showList) {
    const userdetail = getUser();
    setuserDetail(userdetail);
    if (userdetail) {
      servicesService.appointandsub()
        .then((response) => {
          setAppointments(response.appointments);
          setSubscriptions(response.subscriptions);
        })
        .catch((err) => console.error(err));
    }
    servicesService.all()
      .then((data) => {
        setServices(data.services);
        setEmployee(data.prestataires);
      })
      .catch((err) => console.error(err));
  }
}, [showList]);


  useEffect(() => {
    servicesService.all()
      .then((data) => {
        setServices(data.services);
        setLogo(data.logo);
        setBack(data.back);
        setEmployee(data.prestataires);
        console.log('Données reçues de prestataires :', data.prestataires)
      })
      .catch((error) => {useState({})
        console.error('Erreur lors du chargement des services:', error);
      });
  }, []);

  useEffect(() => {
    const userdetail = getUser();
    if (userdetail) {
      setFormData({
        name: userdetail.name,
        phone: userdetail.phone,
        email : userdetail.email || " ",
        address: userdetail.address,
        password:'',
        confirmPassword:'',
        notes: ''
      });
    }
  }, []);

  // useEffect(() => {
  //   servicesService.allappointments()
  //     .then((data) => {     
  //       setAppointmentsall(data.data);
  //       const appointments = data.data;
  //       const disable_date: Date[] = appointments.map((appointment) =>
  //         parseISO(appointment.date_reserver)
  //       );
  //       setIsDisabled(disable_date);
  //     })
  //     .catch((error) => {useState({})
  //       console.error('Erreur lors du chargement des rendez-vous:', error);
  //       setAppointmentsall([]);
  //       setIsDisabled([]);
  //     });
  // }, []);

  useEffect(() => {
  if (paiement !== null) {
      console.log("paiement enregistre", paiement);
    }
  }, [paiement]);


  const refreshPage = () => {
      navigate(0);
  }
  const resetBookingModal = () => {
    setFromSubscription(false);
    setSelectedSubId(null);
    setSelectedService('');
    setSelectedMassageType('');
    setSelectedProvider('');
    setSelectedProviderId(null);
    setSelectedCreneauId(null);
    setSelectedDate(null);
    setSelectedTime('');
    setAvailableCreneaux([]);
  };


  const handleLogout = () => {
      setShowMenu(true);
      setShowList(false);
      setIsLoginOpen(false)
      localStorage.clear();
      refreshPage();
      console.log("deconnexion");
  };

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
  };

  const handlePaiement = async (e: React.FormEvent) => {
    e.preventDefault();
    const minimum = Number(paiementData.price) * (30 / 100);
    if(!paiementData.amount ||  Number(paiementData.amount) < 0 || Number(paiementData.amount) < minimum ) {
      alert("Veuillez sélectionner montant valide");
      return;
    }
    const phoneRegex = /^(034|038)\d{7}$/;
    if (!phoneRegex.test(paiementData.client_phone)) {
      alert("Numéro invalide : il doit commencer par 034 ou 038 et contenir 10 chiffres.");
      return;
    }
    setLoadingpay(true);
    try{
      const payload: Paiement = {
        amount : Number(paiementData.amount),
        price: Number(paiementData.price),
        client_phone: paiementData.client_phone,
        appointment_id: Number(paiementData.appointment_id),
        subscription_id : Number(paiementData.subscription_id),
      };
      const result = await servicesService.pay(payload);
      if (result.success ) {
        alert(result.message);
        resetPaiementForm();
        setIsPaiementOpen(false);
        refreshPage();
      } else{
        alert("erreur " + result.message);
        setLoadingpay(false);
      }

    } catch {
      setLoadingpay(true);
    }
  };

  const getServiceTypes = () => {
    const service = services.find((s) => s.title === selectedService);
    return service?.details?.types || [];
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(null);
    if (!selectedDate) {
      alert("Veuillez sélectionner une date");
      return;
    }
    if (!selectedCreneauId) {
      alert("Veuillez sélectionner un créneau.");
      return;
    }
    if(formData.password != formData.confirmPassword){
      alert("Veuillez saisir le bon mot de passe");
      return;
    } 
    if(addressError != null){
      alert("Veuillez saisir une adresse valide");
      return;
    }
    setLoading(true);
    try {
      const selectedProviderObj = employees.find(e => e.id.toString() === selectedProviderId);
      const selectedCreneauObj = selectedProviderObj?.creneaux.find(
        (c) => Number(c.id) === selectedCreneauId
      );
      // console.log("heure selectionné",selectedCreneauId);
      const startDateTime = `${format(selectedDate, 'yyyy-MM-dd')} ${selectedCreneauObj?.creneau}`;
      const payload: BookingPayload = {
        clients: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password :formData.password,
        },
        sub_id: selectedSubId && Number(selectedSubId) > 0 ? Number(selectedSubId) : null,
        employee_id: Number(selectedProviderId),
        service_id: Number(selectedMassageType),
        start_times: startDateTime,
        end_times : startDateTime,
        comment: formData.notes,
        from_subscription: !!selectedSubId && Number(selectedSubId) > 0
      };

      console.log("ettoo no  alefa",payload);
      const result = await servicesService.book(payload);
      if (result.success && result.data) {
          setPaiement(result.data);
          if(result.data.already_paid){
              alert(result.message);
              refreshPage();
              resetBookingForm();
              setIsBookingOpen(false);
          } else {
              let price = 0;
              if (result.data.price_promo != null) {
                  price = result.data.price_promo;
              } else {
                  price = result.data.price;
              }          
            const finalPrice = result.data.price_promo ?? price; 
            const formattedPrice = finalPrice.toString().replace(/,/g, '');     
            const minimum = (price * 30) / 100; 
            setPaiementData({
              amount: formattedPrice.toString(),
              price: formattedPrice.toString(),
              client_phone: result.data.client_phone || '',
              subscription_id: (result.data.subscription_id ?? '').toString(),
              appointment_id: result.data.appointment_id.toString(),
              minimun : minimum.toString()
            });

            alert('Passez au paiement pour valider votre réservation');
            // setIsPaiementOpen(true);
            setShowPaymentChoice(true);
            resetBookingForm();
            setIsBookingOpen(false);
          }
      } else {
        alert(result.message);
        // resetBookingForm();
      } 
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowTypeDetails = (type: ServiceType) => {
    setSelectedType(type);
    console.log('Type sélectionné:', type);
  };

  const handleBookNow = (service: string) => {
    setSelectedService(service);
    console.log("formule:", selectedService);
    setShowServices(false);
    setShowSportDetails(false);
    setShowCareDetails(false);
    setIsBookingOpen(true);
  };

  const resetBookingForm = () => {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        password:'',
        confirmPassword:'',
        notes: ''
      });
      setSelectedSubId(null);
      setSelectedService('');
      setSelectedMassageType('');
      setSelectedProvider('');
      setSelectedDate(null);
      setSelectedTime('');
  };
    
  const resetLoginForm = () => {
      setClientData({
        login: '',
        password: ''
      });   
      resetLoginForm();
    };

  const resetPaiementForm = () => {
      setPaiementData({
        amount: '',
        price: '',
        client_phone: '',
        subscription_id:'',
        appointment_id: '',
        minimun: ''
      });   
    };
   
  const openLoginModal = async () => {
    const user= localStorage.getItem('user_id');
    const userdetail = getUser();
    setuserDetail(userdetail);
    if(user){
      const reponse = await servicesService.appointandsub();
      setAppointments(reponse.appointments);
      setSubscriptions(reponse.subscriptions);
      setShowList(true);
    }
    setIsLoginOpen(true);
  };  

  const getUser = (): User | null => {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) as User : null;
  };

  const isDisabled = (date: Date) =>
    disabledDates.some((d) => isSameDay(d, date));


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientData ) {
      alert("Veuillez remplir les informations");
      return;
    }

    const payload: Login = {
      login :clientData.login,
      password : clientData.password,
    };

    const result = await servicesService.login(payload);
    const user = result.data;
    if (user && user.id !== undefined) {
      localStorage.setItem("user_id", user.id.toString());
      
      const users: User = {
        name: user.name.toString(),
        phone: user.phone.toString(),
        email: user.email ? user.email.toString() : undefined,
        address : user.address,
      };
      // localStorage.setItem('user', JSON.stringify(users));
      localStorage.setItem("user", JSON.stringify(users));
      const reponse = await servicesService.appointandsub();
      const userdetail = getUser();
      setuserDetail(userdetail);
      setAppointments(reponse.appointments);
      setSubscriptions(reponse.subscriptions);
      setShowList(true);
    }
    if (result.success) {
      resetLoginForm();
      refreshPage();
    } else {
      alert("Erreur : " + result.message);
      resetLoginForm();
    }
  }; 

  const handleClientDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handlePaiementDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaiementData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelect = (id: string) => {
    setSelectedProviderId(id === selectedProviderId ? null : id);
    setSelectedProvider(id); 
  };

  const handleSubscriptionBooking = (subscription: Subscription) => {
    const userdetail = getUser();
    if (userdetail) {
      setFormData({
        name: userdetail.name,
        phone: userdetail.phone,
        email: userdetail.email || '',
        address: userdetail.address,
        password: '',
        confirmPassword:'',
        notes: ''
      });
    }
    setShowList(false);
    setIsLoginOpen(false);
    setIsBookingOpen(true);
    setFromSubscription(true);
    setSelectedSubId(subscription.id);
    setSelectedService(subscription.formule);
    const selectedServiceData = services.find(service => service.title === subscription.formule);
    const serviceTypes: ServiceType[] = selectedServiceData?.details?.types || [];

    if (serviceTypes.length === 0) {
      console.warn('Aucun type de service disponible pour cette formule');
      setSelectedProvider('');
      return;
    }

    const exactMatch: ServiceType | undefined = serviceTypes.find(
      (type: ServiceType) =>
        type.title.toLowerCase().trim() === subscription.service.toLowerCase().trim()
    );

    if (exactMatch) {
      setSelectedMassageType(exactMatch.id);
      console.log(`Service présélectionné (correspondance exacte): ${exactMatch.title}`);
    } else {
      const partialMatch: ServiceType | undefined = serviceTypes.find(
        (type: ServiceType) =>
          type.title.toLowerCase().includes(subscription.service.toLowerCase()) ||
          subscription.service.toLowerCase().includes(type.title.toLowerCase())
      );
      if (partialMatch) {
        setSelectedMassageType(partialMatch.id);
        console.log(`Service présélectionné (correspondance partielle): ${partialMatch.title}`);
      } else {
        console.warn('Aucune correspondance trouvée pour le service :', subscription.service);
      }
      setSelectedProvider('');
    }
  };

  if(showPaymentChoice){
    return (
      <div className="text-center" style={{ fontFamily: 'Agency FB, sans-serif' }}>
        {showPaymentChoice && !selectedMethod && (
          <div className="max-w-md mx-auto px-4 py-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Choisissez votre méthode de paiement</h2>
                <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
                  <button
                    onClick={() => setSelectedMethod('mvola')}
                    className="flex-1 bg-gradient-to-r from-[#f9b131] to-[#f18f34] hover:from-[#f18f34] hover:to-[#f9b131] text-dark px-4 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md hover:shadow-lg"
                  >
                   Payer par MVola
                  </button>
                  {/* <button
                    onClick={() => setSelectedMethod('stripe')}
                    className="flex-1 bg-gradient-to-r from-[#f9b131] to-[#f18f34] hover:from-[#f18f34] hover:to-[#f9b131] text-dark px-4 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md hover:shadow-lg"
                  >
                    Payer par Carte (Stripe)
                  </button> */}
                </div>
 
              </div>
          </div>
        )}

        {selectedMethod === 'mvola' && (
          <div className="min-h-screen bg-gray-50" >
            <div className="bg-gray-50 px-4 py-2 text-sm text-gray-700 flex items-center justify-between">
            </div>
            <div className="max-w-md mx-auto px-4 py-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Paiement MVola</h2>
                <form onSubmit={handlePaiement} className="space-y-4">
                    <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg border border-orange-100 mb-4">
                      <p className="text-sm font-medium text-gray-600">Total à payer</p>
                      {paiement?.price_promo ? (
                        <>
                          <p className="text-lg line-through text-gray-400">{paiement?.price} Ar</p>
                          <p className="text-2xl font-bold text-[#f18f34]">{paiement?.price_promo} Ar</p>
                        </>
                      ) : (
                          <p className="text-2xl font-bold text-[#f18f34]">{paiement?.price} Ar</p>
                      )}

                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro (034 ou 038 seulement)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">+261</span>
                      </div>
                      <input
                        type="text"
                        name="client_phone"
                        value={paiementData.client_phone}
                        onChange={handlePaiementDataChange}
                        className="w-full pl-14 rounded-md border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f18f34] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="amount"
                      value={paiementData.amount}
                      onChange={handlePaiementDataChange}
                      min={paiementData.amount}
                      readOnly
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f18f34] focus:border-transparent"
                      required
                    />
                  </div>
                  <input type="hidden" name="subscription_id" value={paiementData.subscription_id} />
                  <input type="hidden" name="appointment_id" value={paiementData.appointment_id} />
                  <button
                    type="submit"
                    disabled={loadingpay}
                    className="w-full bg-gradient-to-r from-[#f9b131] to-[#f18f34] hover:from-[#f18f34] hover:to-[#f9b131] text-white px-4 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md hover:shadow-lg"
                  >
                    <span>Payer maintenant</span>
                    {loadingpay && (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Traitement paiement en cours...
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'stripe' && (
          <Elements stripe={stripePromise}>
            <PaiementStripe
              amount={Number(paiementData.amount)}
              appointment_id={paiementData.appointment_id}
              subscription_id={paiementData.subscription_id}
              onSuccess={() => {
                alert("Paiement terminé");
                refreshPage();
              }}
            />
          </Elements>
        )}
      </div>
    );
  }


  const renderLoginForm = () => (
      <div className="max-h-[80vh] overflow-y-auto px-4">
        <form 
          onSubmit={handleLogin} 
          className="grid grid-cols-1 md:grid-cols-1 gap-6 pb-4"
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone ou Email
              </label>
              <input
                type="text"
                name="login"
                value={clientData.login}
                onChange={handleClientDataChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Mot de passe 
              </label>
              <input
                type="password"
                name="password"
                value={clientData.password}
                onChange={handleClientDataChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-[#f9b131] hover:bg-[#f18f34] text-white px-4 py-3 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Agency FB, sans-serif' }}
              >
                <CreditCard className="w-5 h-5" />
                Connexion
              </button>
            </div>
          </div>

        </form>
      </div>
  );

  const renderBookingForm = () => (
    <div className="max-h-[80vh] overflow-y-auto px-4">
    <form 
        onSubmit={handleBooking} 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4"
      >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Formule *
          </label>
          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              setSelectedMassageType('');
              setSelectedProvider('');
              
            }}
            className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
            required
            disabled={fromSubscription} 
          >
            <option value="">Sélectionnez une formule</option>
            {services.map((service, index) => (
              <option key={index} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </div>

        {selectedService && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de prestation *
            </label>
            <select
              value={selectedMassageType}
              onChange={(e) => {
                setSelectedMassageType(e.target.value);
                setSelectedProvider('');
              }}
              className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
              required
              disabled={fromSubscription} 
            >
              <option value="">Sélectionnez une prestation</option>
              {getServiceTypes().map((type, index) => (
                <option key={index} value={type.id}>
                  {type.title} - {type.price_promo ? type.price_promo : type.price}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            minDate={new Date()}
            excludeDates={disabledDates}
            placeholderText="Sélectionnez une date"
            className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
            wrapperClassName="w-full" 
            dateFormat="yyyy-MM-dd"
            dayClassName={(date) =>
              isDisabled(date) ? "disabled-red-date" : ""
            }
            renderDayContents={(day, date) =>
              isDisabled(date) ? (
                <div title="Date déjà prise">{day}</div>
              ) : (
                <div>{day}</div>
              )
            }
          />
        </div>
        {selectedService && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionnez un prestataire *
            </label>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
              {employees.map((provider) => (
                <div
                  key={provider.id}
                  className={`border rounded-lg p-1 text-center shadow-xs cursor-pointer transition hover:shadow-md text-sm font-medium ${
                    selectedProviderId === provider.id.toString()
                      ? 'border-[#f18f34] bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  onClick={() => {
                    setSelectedProviderId(provider.id.toString());
                    setSelectedCreneauId(null);
                  }}
                >
                <span className="truncate block text-xs font-medium text-gray-700">
                  {provider.name}
                </span>
                </div>
              ))}
            </div>
              {availableCreneaux.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-y-4 mt-4">
                  {availableCreneaux.map((creneau) => (
                    <button
                      key={creneau.id}
                      type="button"
                      onClick={() => setSelectedCreneauId(creneau.id)}
                      className={`px-2 py-1 rounded-md text-xs border transition ${
                        selectedCreneauId === creneau.id
                          ? 'bg-[#f18f34] text-white border-[#f18f34]'
                          : creneau.is_taken
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                            : 'bg-gray-100 text-black border-gray-200'
                      }`}
                      disabled={creneau.is_taken}
                      title={creneau.is_taken ? 'Indisponible' : 'Disponible'}
                    >
                      {creneau.time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Aucun créneau disponible pour ce prestataire à cette date.
                </p>
              )}

            {/* {selectedProviderId && (() => {
              const selectedProvider = employees.find(e => e.id.toString() === selectedProviderId);
              return (
                <div className="mt-4 p-4 border rounded-lg shadow bg-white">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Créneaux disponibles
                  </h3>

                  {selectedProvider?.creneaux?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.creneaux
                      .filter((value, index, self) =>
                        index === self.findIndex((t) => (
                          t.id === value.id 
                        ))
                      ).map((creneau: any) => (
                        <button
                          key={creneau.id}
                          type="button"
                          onClick={() => setSelectedCreneauId(creneau.id)}
                          className={`px-2 py-1 rounded-md text-xs border transition  ${
                            selectedCreneauId === creneau.id
                              ? 'bg-[#f18f34] text-white border-[#f18f34]'
                              : 'bg-gray-100 text-balck-300 border-gray-200'
                          }`}
                          disabled={!creneau.pivot?.is_active}
                          title={creneau.pivot?.is_active ? 'Disponible' : 'Indisponible'}
                          aria-required
                        >
                          {creneau.creneau}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Aucun créneau disponible pour ce prestataire.
                    </p>
                  )}
                </div>
              );
            })()} */}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
            required
            readOnly={fromSubscription}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
            required
            readOnly={fromSubscription}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email*
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
            required
            readOnly={fromSubscription}
          />
        </div>
        {!localStorage.getItem("user_id") &&(
        <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"   
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmation mot de passe
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">Les mots de passe ne correspondent pas</p>
          )}
        </div>
        </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
            required
            readOnly={fromSubscription}
          />
          {addressError && (
            <p className="text-red-500 text-sm mt-1">{addressError}</p>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes supplémentaires
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f18f34]"
          placeholder="Informations complémentaires pour votre réservation..."
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={loading}
          // disabled={isProcessingPayment}
          className="w-full bg-[#f9b131] hover:bg-[#f18f34] text-white px-4 py-3 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Agency FB, sans-serif' }}
        >
          <CreditCard className="w-5 h-5" />
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Traitement en cours...
            </>
          ) : (
            'Procéder au paiement'
          )}
        </button>
      </div>
    </form>
    </div>
  );

  if (showList) {
    return (
      <div className="min-h-screen bg-white px-4 py-8">
        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-700 flex items-center justify-between">
          <button
            onClick={() => {
              setShowList(false);
              setIsLoginOpen(false);
              refreshPage();
            }}
            className="text-[#f18f34] font-semibold hover:underline"
          >
            ← Retour à l'accueil
          </button>
          <button
            onClick={handleLogout}
            className="bg-[#f18f34] hover:bg-[#f9b131] text-white px-6 py-2 rounded-full transition-colors"
            style={{ fontFamily: 'Agency FB, sans-serif' }}
          >
            Déconnexion
          </button>
        </div>

        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center">
            {logo && (
              <img
                src={logo}
                alt="Domisyl Logo"
                className="h-16"
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                className="bg-white  text-black px-6 py-2 rounded-full transition-colors"
                style={{ fontFamily: 'Agency FB, sans-serif' }}
              >
               {userDetail?.name} ({userDetail?.phone} - {userDetail?.email})
              </button>

            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">*
            {/* liste des rendez-vous */}
             <AppointmentsTable appointments={appointments} />
            {/* Liste des abonnements */}
            <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Agency FB' }}>
                🧾 Mes Abonnements
              </h3>
              <table className="min-w-full divide-y  text-sm text-700" >
                <thead className="bg-[#f18f34] text-white">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Formule</th>
                    <th className="px-6 py-3 text-left font-semibold">Service</th>
                    <th className="px-6 py-3 text-left font-semibold">Séances</th>
                    <th className="px-6 py-3 text-left font-semibold">Période</th>
                    <th className="px-6 py-3 text-left font-semibold">Prix normal</th>
                    <th className="px-6 py-3 text-left font-semibold">Prix promotion</th>
                    <th className="px-6 py-3 text-left font-semibold sticky right-0 bg-[#f18f34] z-10">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {subscriptions?.data?.map((sub, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium">{sub.formule}</td>
                    <td className="px-6 py-4">{sub.service}</td>
                    <td className="px-6 py-4">
                      {sub.used_session} / {sub.total_session}
                    </td>
                    <td className="px-6 py-4">{sub.date_debut} → {sub.date_fin}</td>
                    <td className="px-6 py-4">{sub.prixservice} Ar</td>
                    <td className="px-6 py-4">
                      {sub.prixpromo ? `${sub.prixpromo} Ar` : '-'}
                    </td>

                    <td className="px-6 py-4 sticky right-0 bg-white z-10">
                      <button
                        onClick={() => {
                          setShowList(false);
                          setIsLoginOpen(false);
                          handleSubscriptionBooking(sub);
                        }}
                        className="bg-[#f9b131] hover:bg-[#fdc800] text-[#1d1d1b] px-2 py-1 rounded-full flex items-center gap-1 transition-colors"
                        style={{ fontFamily: 'Agency FB, sans-serif' }}>
                        Prendre RDV
                      </button>
                    </td>
                  </tr>
                ))}

                {/* <thead className="bg-[#f18f34] text-white">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Formule</th>
                    <th className="px-6 py-3 text-left font-semibold">Service</th>
                    <th className="px-6 py-3 text-left font-semibold">Séances</th>
                    <th className="px-6 py-3 text-left font-semibold">Période</th>
                    <th className="px-6 py-3 text-left font-semibold">Prix</th>
                    <th className="px-6 py-3 text-left font-semibold"></th>
                  </tr>
                </thead> 
                <tbody className="divide-y divide-gray-100 bg-white">
                  {subscriptions?.data?.map((sub, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium">{sub.formule}</td>
                      <td className="px-6 py-4">{sub.service}</td>
                      <td className="px-6 py-4">
                        {sub.used_session} / {sub.total_session}
                      </td>
                      <td className="px-6 py-4 text-base text-gray-800 font-medium whitespace-nowrap">
                        {sub.date_debut} <span className="text-gray-500 font-normal">→</span> {sub.date_fin}
                      </td>
                      <td className="px-6 py-4">{sub.prixservice} Ar</td>
                      <td className="px-6 py-4 text-base text-gray-800 font-medium whitespace-nowrap">
                        <button
                            onClick={() => {
                                    setShowList(false);
                                    setIsLoginOpen(false);
                                    handleSubscriptionBooking(sub);
                                  }}
                            className="bg-[#fdc800] hover:bg-[#f9b131] text-[#1d1d1b] px-2 py-1 rounded-full flex items-center gap-1 transition-colors"
                            style={{ fontFamily: 'Agency FB, sans-serif' }}>
                            Prendre RDV
                        </button>
                      </td>
                    </tr>
                  ))}

                  {subscriptions?.data?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500 italic">
                        Aucun abonnement trouvé.
                      </td>
                    </tr>
                  )}
                </tbody> */}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (showServices && selectedShowService) {
    const service = services.find(
      s => s.title.toLowerCase().trim() === selectedShowService.toLowerCase().trim()
    );
    console.log(service);
    if (!service) {
      return <div>Service introuvable.</div>;
    }
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => setShowServices(false)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h1 className="mx-auto text-4xl mb-5 text-[#1d1d1b] text-center" style={{ fontFamily: 'Agency FB, sans-serif' }}>
                {service.title}
              </h1>
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-[400px] object-cover rounded-2xl"
              />
              <button
                onClick={() => handleBookNow(service.title)}
                className="mx-auto bg-[#f18f34] hover:bg-[#f9b131] text-black px-4 py-1 rounded-full transition-colors flex items-center justify-center"
                style={{ fontFamily: 'Agency FB, sans-serif', display: 'block' }}
              >
                Réserver 
              </button>

            </div>
            <div>
              <div className="mb-8">
                <div className="space-y-4">
                  {Array.isArray(service.details?.types) &&
                   service.details.types.map((type, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg ">
                      <div className="mb-2">
                        {type.price_promo && (
                          // bg-[#f18f34]
                          <span className="inline-flex items-center gap-1 bg-[red] text-white text-xs font-bold px-1 py-0 rounded-full">
                            <Sparkles className="w-3 h-3" />
                            Promotion
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">{type.title}</h3>
                          <div className="flex items-center gap-3">
                            {type.price_promo ? (
                              <>
                                <span className="inline-flex items-center gap-2">
                                  <span className="line-through text-gray-400">
                                    {type.price}
                                    {Number(type.validity_days) === 30 ? '' : ''}
                                  </span>
                                  <span className="text-[#f18f34] font-semibold">
                                    {type.price_promo}
                                    {Number(type.validity_days) === 30 ? '/mois' : ''}
                                  </span>

                                </span>
                              </>
                            ) : (
                              <span className="text-[#f18f34] font-semibold">
                                {type.price}
                                {Number(type.validity_days) === 30 ? '/mois' : ''}
                              </span>
                            )}
                        </div>

           
                      </div>
                      <div className="flex items-center text-gray-500 text-sm justify-between">
                        <div dangerouslySetInnerHTML={{ __html: type.description }} />
                        
                        {type.sessions.some(session => parseInt(session.session_per_period) > 0) && (
                          <div className="ml-auto">
                            <button
                              onClick={() => handleShowTypeDetails(type)}
                              className="w-fit bg-[#f9b131] hover:bg-[#f18f34] text-black px-4 py-1 rounded-full transition-colors flex items-center justify-center gap-1"
                              style={{ fontFamily: 'Agency FB, sans-serif' }}
                            >
                              Détails
                            </button>
                          </div>
                        )}
                      </div>
                      {selectedType?.title === type.title && (
                        <div className="mt-4 p-4 bg-[#f9b131] from-orange-100 to-white border border-orange-300 rounded-xl">
                          <div dangerouslySetInnerHTML={{ __html: type.detail }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: 'Agency FB, sans-serif', display: 'block' }} >{service.remarque}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mb-5">
      {/* Hero Section */}
      <header className="relative h-screen">
        {/* Image de fond */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${back})`, backgroundPosition: 'center 15%' }}
        >
        <div className="absolute inset-0" />
        </div>
          <div className="absolute top-8 left-1/5 transform -translate-x-1/2 z-30 overflow-hidden w-full px-4 sm:px-6">
            <div
              className="bg-[#f18f34] text-white text-center py-4 sm:py-6 shadow-2xl relative"
              style={{
                transform: 'rotate(-35deg)',
                transformOrigin: 'center center',
                width: '120%',
                maxWidth: '1600px',
                fontFamily: 'Agency FB, sans-serif',
                boxShadow: '0 0 20px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.1)',
              }}
            >
              <p className="font-extrabold text-base sm:text-lg md:text-xl leading-tight drop-shadow-lg">
                OFFRES SPÉCIALES LANCEMENT<br />
                <span className="text-yellow-200 text-lg sm:text-xl md:text-2xl">-25%</span> sur toutes les prestations<br />
                <span className="text-sm sm:text-base bg-black/30 px-2 py-1 rounded">
                  du 20/09 au 20/10/2025
                </span>
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-slide"></div>
            </div>
          </div>

          {/* Nav : bouton Mon Compte à droite */}
          <nav className="relative z-20 flex justify-end px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto">
            <button 
              onClick={openLoginModal}
              className="bg-[#f18f34] hover:bg-[#f9b131] text-white px-4 sm:px-6 py-2 rounded-full transition-colors text-sm sm:text-base md:text-lg"
              style={{ fontFamily: 'Agency FB, sans-serif' }}
            >
              Mon Compte
            </button>
          </nav>

        {/* Contenu central */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 md:px-8 mt-20 sm:mt-15 md:mt-25">
          <h1 className="text-3xl sm:text-5xl md:text-7xl text-white mb-4 font-extrabold" style={{ fontFamily: 'Agency FB, sans-serif' }}>
            Votre Bien-être à Domicile
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-white mb-6 max-w-2xl">
            Découvrez nos services de massage, sport et soins du corps, 
            directement chez vous pour un maximum de confort.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-[#f9b131] hover:bg-[#fdc800] text-[#1d1d1b] px-6 sm:px-8 py-3 rounded-full flex items-center gap-2 transition-colors text-sm sm:text-base md:text-lg"
              style={{ fontFamily: 'Agency FB, sans-serif' }}
            >
              <Calendar className="w-5 h-5" />
              Prendre RDV
            </button>
            <button 
              onClick={() => setIsContactOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-3 rounded-full flex items-center gap-2 backdrop-blur-sm transition-colors text-sm sm:text-base md:text-lg"
              style={{ fontFamily: 'Agency FB, sans-serif' }}
            >
              <MessageSquare className="w-5 h-5" />
              Nous Contacter
            </button>
          </div>
        </div>
      </header>
      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-4xl text-center mb-16 text-[#1d1d1b]"
            style={{ fontFamily: 'Agency FB, sans-serif' }}
          >
            Nos Services
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
              <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 
                      className="text-2xl text-[#1d1d1b]"
                      style={{ fontFamily: 'Agency FB, sans-serif' }}
                    >
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    { service.description}
                  </p>
                </div>
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    onClick={() => {
                      setSelectedShowService(service.title);
                      setShowServices(true);            
                    }}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <button 
                  onClick={() => {
                    setSelectedShowService(service.title);
                    setShowServices(true);            
                  }}
                  className="mt-6 w-full bg-[#f9b131] hover:bg-[#f18f34] text-[#1d1d1b] py-2 rounded-full transition-colors"
                  style={{ fontFamily: 'Agency FB, sans-serif' }}
                >
                  En savoir plus
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-4xl text-center mb-12 text-[#1d1d1b]"
            style={{ fontFamily: 'Agency FB, sans-serif' }}
          >
            Contactez-nous
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <a 
              href="mailto:contact@groupe-syl.com"
              className="flex items-center gap-3 text-gray-700 hover:text-[#f18f34] transition-colors group"
            >
              <div className="bg-white p-4 rounded-full shadow-md group-hover:shadow-lg transition-shadow">
                <Mail className="w-8 h-8 text-[#f18f34]" />
              </div>
              <span className="text-lg">contact@groupe-syl.com</span>
            </a>
            
            <a 
              href="tel:+261326053801"
              className="flex items-center gap-3 text-gray-700 hover:text-[#f18f34] transition-colors group"
            >
              <div className="bg-white p-4 rounded-full shadow-md group-hover:shadow-lg transition-shadow">
                <Phone className="w-8 h-8 text-[#f18f34]" />
              </div>
              <span className="text-lg">+261 38 93 684 05</span>
            </a>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title
                className="text-2xl font-medium text-gray-900"
                style={{ fontFamily: 'Agency FB, sans-serif' }}
              >
                Réservation
              </Dialog.Title>
              <button
                onClick={() => {
                  setIsBookingOpen(false);
                  resetBookingModal();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {renderBookingForm()}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* connexion  */}
      <Dialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-md w-full bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-2xl font-medium text-gray-900">
                Connexion
              </Dialog.Title>
              <button onClick={() => setIsLoginOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            {renderLoginForm()}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Contact Modal */}
      <Dialog
        open={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title
                className="text-2xl font-medium text-gray-900"
                style={{ fontFamily: 'Agency FB, sans-serif' }}
              >
                Contactez-nous
              </Dialog.Title>
              <button
                onClick={() => setIsContactOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <a 
                href="mailto:contact@groupe-syl.com"
                className="flex items-center gap-3 text-gray-700 hover:text-[#f18f34] transition-colors p-4 rounded-lg hover:bg-gray-50"
              >
                <Mail className="w-6 h-6" />
                <span>contact@groupe-syl.com</span>
              </a>
              
              <a 
                href="tel:+261326053801"
                className="flex items-center gap-3 text-gray-700 hover:text-[#f18f34] transition-colors p-4 rounded-lg hover:bg-gray-50"
              >
                <Phone className="w-6 h-6" />
                <span>+261 38 93 684 05</span>
              </a>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default App;