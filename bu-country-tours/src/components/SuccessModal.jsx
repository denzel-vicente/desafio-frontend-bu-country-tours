import { useEffect, useState } from 'react';
import { useAppContext } from '../context/useAppContext';
import { CheckCircle, X, Receipt } from 'lucide-react';
import { useTourBooking } from '../hooks/useTourBooking';

export const SuccessModal = () => {
  const { showSuccessModal, setShowSuccessModal, bookingDetails, activeTour, currency } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);

  const { adults, children, selectedDate, formattedTotal } = useTourBooking(activeTour, currency);

  useEffect(() => {
    if (showSuccessModal) {
      setTimeout(() => setIsVisible(true), 10);
    }
  }, [showSuccessModal]);

  if (!showSuccessModal) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowSuccessModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  // Format date correctly
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className={`bg-gray-50 rounded-3xl shadow-2xl max-w-md w-full relative z-[10000] flex flex-col transform transition-all duration-300 overflow-hidden ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'}`}>
        
        {/* Top Section */}
        <div className="bg-emerald-600 px-8 pt-10 pb-12 flex flex-col items-center text-center relative overflow-hidden">
          {/* Background pattern/decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl translate-x-1/2 translate-y-1/2"></div>
          </div>

          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative mb-6 mt-2">
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
            <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2 relative z-10">Reserva Confirmada!</h2>
          <p className="text-emerald-50 relative z-10 font-medium">Preparamos tudo para você. Boa viagem!</p>
        </div>
        
        {/* Voucher Separator */}
        <div className="relative h-6 bg-gray-50 flex items-center justify-between px-2 -mt-3 z-20">
          <div className="w-6 h-6 bg-black/60 rounded-full -ml-5 shadow-inner"></div>
          <div className="flex-grow border-t-2 border-dashed border-gray-300 mx-2"></div>
          <div className="w-6 h-6 bg-black/60 rounded-full -mr-5 shadow-inner"></div>
        </div>

        {/* Voucher Details */}
        <div className="bg-gray-50 p-8 pt-4 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-gray-400 mb-2 justify-center">
            <Receipt className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase">Recibo Oficial</span>
          </div>

          <div className="flex flex-col gap-1 border-b border-gray-200 pb-4">
            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Passageiro Principal</span>
            <span className="font-black text-gray-900 text-lg">{bookingDetails?.passengerName}</span>
          </div>
          
          <div className="flex flex-col gap-1 border-b border-gray-200 pb-4">
            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Experiência</span>
            <span className="font-bold text-gray-800 leading-tight">{bookingDetails?.tourTitle}</span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Data</span>
              <span className="font-bold text-gray-900">{formatDate(selectedDate)}</span>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Participantes</span>
              <span className="font-bold text-gray-900">
                {adults} {adults > 1 ? 'Adultos' : 'Adulto'} 
                {children > 0 && ` | ${children} ${children > 1 ? 'Crianças' : 'Criança'}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-end pt-2 bg-gray-100 p-4 rounded-xl border border-gray-200">
            <span className="text-sm uppercase font-bold text-gray-500 tracking-wider">Total Pago</span>
            <span className="text-3xl font-black text-emerald-700">{formattedTotal}</span>
          </div>

          <button 
            onClick={handleClose}
            className="w-full mt-4 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
          >
            Voltar para Descoberta
          </button>
        </div>
      </div>
  );
};
