import { useState } from 'react';
import { useAppContext } from '../context/useAppContext';
import { Loader2 } from 'lucide-react';

export const CheckoutForm = () => {
  const { checkoutData, setCheckoutData, setShowCheckout, setShowSuccessModal, setBookingDetails, activeTour } = useAppContext();
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({ ...prev, [name]: value }));
    // clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!checkoutData.fullName.trim()) newErrors.fullName = 'O nome completo é obrigatório.';
    
    if (!checkoutData.email.trim()) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!checkoutData.email.includes('@')) {
      newErrors.email = 'Insira um e-mail válido (deve conter @).';
    }

    if (!checkoutData.phone.trim()) {
      newErrors.phone = 'O telefone é obrigatório.';
    } else {
      const strippedPhone = checkoutData.phone.replace(/[\s-()]/g, '');
      if (!/^\d+$/.test(strippedPhone)) {
        newErrors.phone = 'O telefone deve conter apenas números.';
      }
    }

    if (!checkoutData.docNumber.trim()) {
      newErrors.docNumber = 'O número do documento é obrigatório.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call for financial authorization
      setTimeout(() => {
        setIsSubmitting(false);
        setBookingDetails({
          tourTitle: activeTour.title,
          passengerName: checkoutData.fullName,
        });
        setShowSuccessModal(true);
        setShowCheckout(false);
        // Clear form
        setCheckoutData({
          fullName: '',
          email: '',
          phone: '',
          docType: 'Passaporte',
          docNumber: ''
        });
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mt-6 relative overflow-hidden animate-fade-in-down" id="checkout-form">
      <h3 className="text-2xl font-black text-gray-900 mb-8">Dados do Viajante Principal</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-sm font-bold text-gray-700">Nome Completo</label>
          <input 
            type="text" 
            name="fullName"
            value={checkoutData.fullName}
            onChange={handleChange}
            className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:bg-white transition-all bg-gray-50 text-gray-900 font-medium ${errors.fullName ? 'border-red-400 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200 focus:ring-emerald-500/10 focus:border-emerald-500 hover:border-gray-300'}`}
            placeholder="Ex: João da Silva"
          />
          {errors.fullName && <span className="text-sm font-medium text-red-600 animate-fade-in-down absolute -bottom-6 left-1" aria-live="polite">{errors.fullName}</span>}
        </div>

        <div className="flex flex-col gap-1.5 relative mt-3">
          <label className="text-sm font-bold text-gray-700">E-mail</label>
          <input 
            type="email" 
            name="email"
            value={checkoutData.email}
            onChange={handleChange}
            className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:bg-white transition-all bg-gray-50 text-gray-900 font-medium ${errors.email ? 'border-red-400 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200 focus:ring-emerald-500/10 focus:border-emerald-500 hover:border-gray-300'}`}
            placeholder="Ex: joao@email.com"
          />
          {errors.email && <span className="text-sm font-medium text-red-600 animate-fade-in-down absolute -bottom-6 left-1" aria-live="polite">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1.5 relative mt-3">
          <label className="text-sm font-bold text-gray-700">Telefone</label>
          <input 
            type="tel" 
            name="phone"
            value={checkoutData.phone}
            onChange={handleChange}
            className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:bg-white transition-all bg-gray-50 text-gray-900 font-medium ${errors.phone ? 'border-red-400 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200 focus:ring-emerald-500/10 focus:border-emerald-500 hover:border-gray-300'}`}
            placeholder="Ex: 11999999999"
          />
          {errors.phone && <span className="text-sm font-medium text-red-600 animate-fade-in-down absolute -bottom-6 left-1" aria-live="polite">{errors.phone}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Documento</label>
            <select 
              name="docType"
              value={checkoutData.docType}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 hover:border-gray-300 focus:bg-white transition-all bg-gray-50 text-gray-900 font-medium cursor-pointer"
            >
              <option value="Passaporte">Passaporte</option>
              <option value="CNI">CNI</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-sm font-bold text-gray-700">Número</label>
            <input 
              type="text" 
              name="docNumber"
              value={checkoutData.docNumber}
              onChange={handleChange}
              className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:bg-white transition-all bg-gray-50 text-gray-900 font-medium ${errors.docNumber ? 'border-red-400 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200 focus:ring-emerald-500/10 focus:border-emerald-500 hover:border-gray-300'}`}
              placeholder="Número do documento"
            />
            {errors.docNumber && <span className="text-sm font-medium text-red-600 animate-fade-in-down absolute -bottom-6 left-1" aria-live="polite">{errors.docNumber}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 disabled:cursor-wait text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-gray-900/20 active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Processando pagamento...</span>
              </>
            ) : (
              'Confirmar Reserva e Pagar'
            )}
          </button>
          
          {!isSubmitting && (
            <button 
              type="button"
              className="w-full bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 font-bold py-4 rounded-2xl transition-colors border-2 border-transparent hover:border-gray-200"
              onClick={() => setShowCheckout(false)}
            >
              Cancelar e voltar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
