import { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { AppContextProvider } from './context/AppContext';
import { useAppContext } from './context/useAppContext';
import { TourDetails } from './components/TourDetails';
import { BookingWidget } from './components/BookingWidget';
import { CheckoutForm } from './components/CheckoutForm';
import { SuccessModal } from './components/SuccessModal';
import { Footer } from './components/Footer';

const Header = () => {
  const { currency, setCurrency } = useAppContext();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-28 md:h-16 flex justify-between items-center">
        <div className="flex items-center gap-3 text-emerald-700">
          <MapPin className="w-10 h-10 md:w-6 md:h-6" />
          <span className="text-2xl md:text-xl font-black tracking-tight">Bu Country Tours</span>
        </div>
        
        <div className="flex items-center bg-gray-100 p-1.5 md:p-0.5 rounded-lg">
          <button 
            className={`px-5 md:px-3 py-2.5 md:py-1 rounded-md text-base md:text-xs font-bold transition-all ${currency === 'EUR' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setCurrency('EUR')}
          >
            EUR (€)
          </button>
          <button 
            className={`px-5 md:px-3 py-2.5 md:py-1 rounded-md text-base md:text-xs font-bold transition-all ${currency === 'USD' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setCurrency('USD')}
          >
            USD ($)
          </button>
        </div>
      </div>
    </header>
  );
};

const MainContent = () => {
  return (
    <div className="max-w-7xl mx-auto px-2 md:px-8 py-4 md:py-8 flex flex-col md:flex-row gap-4 md:gap-8 relative md:scale-[0.95] origin-top">
      <TourDetails />
      <aside className="w-full md:w-1/3 flex flex-col">
        <BookingWidget />
      </aside>
    </div>
  );
};

function AppContent() {
  const { showCheckout, showSuccessModal } = useAppContext();

  useEffect(() => {
    if (showCheckout || showSuccessModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }
    return () => { 
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [showCheckout, showSuccessModal]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <div className="flex-grow">
        <Header />
        <MainContent />
      </div>
      <Footer />

      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 backdrop-blur-md w-screen h-screen">
          <SuccessModal />
        </div>
      )}
      
      {showCheckout && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 backdrop-blur-md w-screen h-screen">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col z-[10000]">
            <CheckoutForm />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
