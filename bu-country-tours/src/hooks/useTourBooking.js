import { useState } from 'react';

export const useTourBooking = (tour, currency) => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');

  const CONVERSION_RATE = 0.95; // 1 USD = 0.95 EUR
  const minDate = '2026-05-22';

  const totalCapacity = adults + children;
  const canIncrement = totalCapacity < tour.maxCapacityPerSlot;

  const incrementAdults = () => {
    if (canIncrement) setAdults(prev => prev + 1);
  };

  const decrementAdults = () => {
    if (adults > 1) setAdults(prev => prev - 1);
  };

  const incrementChildren = () => {
    if (canIncrement) setChildren(prev => prev + 1);
  };

  const decrementChildren = () => {
    if (children > 0) setChildren(prev => prev - 1);
  };

  const isDateUnavailable = (dateString) => {
    return tour.unavailableDates.includes(dateString);
  };

  const handleDateChange = (date) => {
    if (isDateUnavailable(date)) {
      alert('Esta data está indisponível. Por favor, escolha outra data.');
      setSelectedDate('');
    } else {
      setSelectedDate(date);
    }
  };

  const calculatePrice = (amountUSD) => {
    // Assuming JSON base price is in USD
    if (currency === 'EUR') {
      return (amountUSD / CONVERSION_RATE);
    }
    return amountUSD;
  };

  const formatCurrency = (amount) => {
    const symbol = currency === 'EUR' ? '€' : '$';
    return `${symbol} ${amount.toFixed(2)}`;
  };

  const adultSubtotalUSD = adults * tour.prices.adult;
  const childSubtotalUSD = children * tour.prices.child;
  const totalPriceUSD = adultSubtotalUSD + childSubtotalUSD;

  const adultSubtotal = calculatePrice(adultSubtotalUSD);
  const childSubtotal = calculatePrice(childSubtotalUSD);
  const totalPrice = calculatePrice(totalPriceUSD);

  const formattedTotal = formatCurrency(totalPrice);
  const formattedAdultPrice = formatCurrency(calculatePrice(tour.prices.adult));
  const formattedChildPrice = formatCurrency(calculatePrice(tour.prices.child));

  return {
    adults,
    children,
    selectedDate,
    totalPrice,
    formattedTotal,
    formattedAdultPrice,
    formattedChildPrice,
    adultSubtotal: formatCurrency(adultSubtotal),
    childSubtotal: formatCurrency(childSubtotal),
    incrementAdults,
    decrementAdults,
    incrementChildren,
    decrementChildren,
    setSelectedDate: handleDateChange,
    canIncrement,
    minDate,
    isDateUnavailable,
    capacityRemaining: tour.maxCapacityPerSlot - totalCapacity
  };
};
