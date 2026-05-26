import { useState, useEffect } from 'react';
import { useAppContext } from '../context/useAppContext';
import { useTourBooking } from '../hooks/useTourBooking';
import { Users, AlertCircle, Calendar, ChevronUp, X } from 'lucide-react';

export const BookingWidget = () => {
  const { activeTour, currency, setShowCheckout } = useAppContext();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      setIsAtBottom(atBottom);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const {
    adults,
    children,
    selectedDate,
    formattedTotal,
    formattedAdultPrice,
    formattedChildPrice,
    adultSubtotal,
    childSubtotal,
    incrementAdults,
    decrementAdults,
    incrementChildren,
    decrementChildren,
    setSelectedDate,
    canIncrement,
    minDate,
    capacityRemaining
  } = useTourBooking(activeTour, currency);

  if (!activeTour) return null;

  const handleReserve = () => {
    setIsMobileSheetOpen(false);
    setShowCheckout(true);
    // on mobile, scroll checkout into view might be needed, but it renders adjacent
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const mobileBottomBar = (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] lg:hidden flex justify-between items-center transition-transform duration-300 ${isAtBottom ? 'translate-y-full' : 'translate-y-0'}`}>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Estimado</span>
        <span className="text-2xl font-black text-gray-900">{formattedTotal}</span>
      </div>
      <button 
        onClick={() => setIsMobileSheetOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-all flex items-center gap-2"
      >
        Ver Datas
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );

  const renderWidgetContent = () => (
    <div className="flex flex-col gap-6 w-full">
      {/* Pricing Header */}
      <div className="flex flex-col gap-1 pb-5 border-b border-gray-100">
        <div className="flex justify-between items-end">
          <span className="text-gray-500 font-medium">Adulto</span>
          <span className="text-2xl font-black text-gray-900">{formattedAdultPrice}</span>
        </div>
        <div className="flex justify-between items-end mt-1">
          <span className="text-gray-500 text-sm font-medium">Criança (2-11 anos)</span>
          <span className="text-gray-600 font-bold">{formattedChildPrice}</span>
        </div>
      </div>

      {/* Date Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          Data da Experiência
        </label>
        <input 
          type="date" 
          min={minDate}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-gray-900 bg-white transition-all font-medium cursor-pointer"
          data-testid="date-input"
          onClick={(e) => e.target.showPicker && e.target.showPicker()}
        />
      </div>

      {/* Guests Selection */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Participantes
          </label>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${capacityRemaining > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {capacityRemaining > 0 ? `${capacityRemaining} vagas` : 'Lotação máxima'}
          </span>
        </div>

        <div className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl bg-white">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">Adultos</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={decrementAdults}
              disabled={adults <= 1}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-emerald-700 transition-colors"
            >
              <span className="text-xl font-medium">-</span>
            </button>
            <span className="w-6 text-center font-black text-gray-900 text-lg">{adults}</span>
            <button 
              onClick={incrementAdults}
              disabled={!canIncrement}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-emerald-700 transition-colors"
            >
              <span className="text-xl font-medium">+</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl bg-white">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">Crianças</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={decrementChildren}
              disabled={children <= 0}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-emerald-700 transition-colors"
            >
              <span className="text-xl font-medium">-</span>
            </button>
            <span className="w-6 text-center font-black text-gray-900 text-lg" data-testid="children-count">{children}</span>
            <button 
              onClick={incrementChildren}
              disabled={!canIncrement}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-emerald-700 transition-colors"
              data-testid="increment-children"
            >
              <span className="text-xl font-medium">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-500 font-medium">
          <span>{adults} × Adultos</span>
          <span className="text-gray-900">{adultSubtotal}</span>
        </div>
        {children > 0 && (
          <div className="flex justify-between text-sm text-gray-500 font-medium">
            <span>{children} × Crianças</span>
            <span className="text-gray-900">{childSubtotal}</span>
          </div>
        )}
        
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-200">
          <span className="font-bold text-gray-900 text-lg">Total</span>
          <span className="text-3xl font-black text-emerald-700" data-testid="total-price">{formattedTotal}</span>
        </div>
      </div>

      {/* Submit */}
      <button 
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98] mt-2 flex justify-center items-center gap-2"
        disabled={!selectedDate}
        onClick={handleReserve}
        data-testid="btn-reserve"
      >
        {selectedDate ? 'Reservar Agora' : 'Selecione uma data'}
      </button>

      {!selectedDate && (
        <div className="flex items-center gap-2 text-amber-600 text-sm justify-center bg-amber-50 py-2 px-4 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">Data obrigatória para reservar</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobile && !isMobileSheetOpen && mobileBottomBar}

      {/* Mobile Bottom Sheet Overlay */}
      {isMobile && isMobileSheetOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-end justify-center transition-opacity">
          <div className="bg-white w-full rounded-t-3xl p-6 pb-8 shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setIsMobileSheetOpen(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-black text-gray-900 mb-6">Fazer Reserva</h3>
            {renderWidgetContent()}
          </div>
        </div>
      )}

      {/* Desktop/General Container */}
      <div className="block bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-28 z-10 w-full" data-testid="booking-widget">
        {renderWidgetContent()}
      </div>
    </>
  );
};
