import { useState, useMemo, useEffect } from 'react';
import toursData from '../tours.json';
import { AppContext } from './AppContextInstance';

export const AppContextProvider = ({ children }) => {
  const [tours] = useState(toursData);
  const [activeTour, setActiveTour] = useState(toursData[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [currency, setCurrency] = useState('EUR'); // 'EUR' or 'USD'
  
  // Checkout State
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  
  const [checkoutData, setCheckoutData] = useState(() => {
    const saved = localStorage.getItem('bu_checkout_data');
    return saved ? JSON.parse(saved) : {
      fullName: '',
      email: '',
      phone: '',
      docType: 'Passaporte',
      docNumber: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('bu_checkout_data', JSON.stringify(checkoutData));
  }, [checkoutData]);

  // Derived state: Filtered Tours
  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tour.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory ? tour.category === selectedCategory : true;
      
      const tourMaxPrice = Math.max(tour.prices.adult, tour.prices.child);
      const matchesPrice = tourMaxPrice <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [tours, searchTerm, selectedCategory, maxPrice]);

  const value = {
    tours,
    filteredTours,
    activeTour,
    setActiveTour,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    maxPrice,
    setMaxPrice,
    currency,
    setCurrency,
    checkoutData,
    setCheckoutData,
    showCheckout,
    setShowCheckout,
    showSuccessModal,
    setShowSuccessModal,
    bookingDetails,
    setBookingDetails
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
