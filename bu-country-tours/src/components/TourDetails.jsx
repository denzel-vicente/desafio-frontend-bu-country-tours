import { useState, useEffect } from 'react';
import { useAppContext } from '../context/useAppContext';
import { Search, MapPin, Star, Clock, Check, Info } from 'lucide-react';
import { SkeletonLoader } from './SkeletonLoader';

export const TourDetails = () => {
  const { 
    filteredTours, 
    activeTour, 
    setActiveTour, 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory,
    maxPrice,
    setMaxPrice,
    currency
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = ["Aventura e Natureza", "Gastronomia", "Cultural e Histórico"];

  const formatPrice = (amountUSD) => {
    if (currency === 'EUR') return `€ ${(amountUSD / 0.95).toFixed(2)}`;
    return `$ ${amountUSD.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col lg:w-2/3 gap-8">
      {/* Filters Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Para onde você quer ir?" 
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-gray-900 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Category Carousel Mobile */}
        <div className="flex overflow-x-auto snap-x snap-mandatory flex-nowrap gap-3 pb-2 -mx-2 px-2 hide-scrollbar">
          <button 
            className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === null ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setSelectedCategory(null)}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm font-bold text-gray-700">
            <label>Preço Máximo</label>
            <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">{formatPrice(maxPrice)}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>
      </div>

      {/* Active Tour Details */}
      {activeTour && !isLoading && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-4">
          <div className="p-5 md:p-8 flex flex-col gap-6">
            
            {/* Gallery: Responsive */}
            <div className="flex flex-col gap-2">
              <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-2 pb-4 -mx-5 px-5">
                {activeTour.images && activeTour.images.length > 0 ? (
                  activeTour.images.map((img, i) => (
                    <div key={i} className="min-w-[90%] h-64 snap-center rounded-2xl overflow-hidden relative">
                      <img src={img} alt={activeTour.title} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="min-w-[90%] h-64 bg-gray-100 flex items-center justify-center rounded-2xl">
                    <span className="text-gray-400">Sem imagem disponível</span>
                  </div>
                )}
              </div>
              
              <div className="hidden md:grid gap-2 h-[400px] rounded-2xl overflow-hidden" style={{ gridTemplateColumns: activeTour.images?.length === 1 ? '1fr' : '2fr 1fr' }}>
                <div className="w-full h-full relative">
                  <img src={activeTour.images?.[0] || 'https://via.placeholder.com/800'} alt={activeTour.title} className="w-full h-full object-cover" />
                </div>
                {activeTour.images?.length > 1 && (
                  <div className="grid grid-rows-2 gap-2 h-full">
                    <img src={activeTour.images[1] || 'https://via.placeholder.com/400'} alt="" className="w-full h-full object-cover" />
                    {activeTour.images[2] ? (
                      <img src={activeTour.images[2]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">
                        <MapPin className="w-8 h-8 opacity-50" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Header Info */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wide">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{activeTour.location}</span>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-600">{activeTour.category}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">
                {activeTour.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                  <Star className="w-5 h-5 text-amber-500 fill-current" />
                  <span className="font-bold text-amber-600 text-lg">{activeTour.rating}</span>
                </div>
                <span className="text-gray-500 font-medium text-sm underline decoration-gray-300 underline-offset-4">
                  {activeTour.reviewsCount} avaliações
                </span>
              </div>
            </div>

            {/* Badges WCAG */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-6 border-y border-gray-100">
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">Duração</span>
                <span className="text-sm font-bold text-gray-900">{activeTour.duration}</span>
              </div>
              
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1">
                <Info className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">Idiomas</span>
                <span className="text-sm font-bold text-gray-900 truncate w-full">{activeTour.languages[0]} {activeTour.languages.length > 1 && '+'}</span>
              </div>

              <div className={`col-span-2 md:col-span-2 p-3 rounded-xl flex items-center justify-center gap-2 text-center ${activeTour.freeCancellation ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
                {activeTour.freeCancellation ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-800">Cancelamento Grátis</span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-rose-800">Não Reembolsável</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="text-gray-600 leading-relaxed text-lg">
              {activeTour.description}
            </div>

            {/* Highlights */}
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50 mt-2">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">O que você fará</h3>
              <ul className="flex flex-col gap-4">
                {activeTour.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-700">
                    <div className="mt-0.5 bg-amber-100 p-1 rounded-full text-amber-600 flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="leading-snug">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* Tours List */}
      <div className="mt-8 px-2 md:px-0">
      <h2 className="text-xl font-black text-gray-900 mb-6">Mais opções para você ({filteredTours.length})</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoader variant="card" count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredTours.map(tour => (
            <div 
              key={tour.id} 
              className={`bg-white rounded-3xl shadow-sm border overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg ${activeTour?.id === tour.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-100'} scale-95 md:scale-100`}
              onClick={() => {
                setActiveTour(tour);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="h-56 overflow-hidden relative">
                <img src={tour.images[0]} alt={tour.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                  {tour.category}
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <h3 className="font-bold text-gray-900 line-clamp-2 text-lg leading-snug">{tour.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="truncate">{tour.location}</span>
                </div>
                <div className="flex justify-between items-end mt-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="font-bold text-gray-900">{tour.rating}</span>
                    <span className="text-gray-400 text-sm">({tour.reviewsCount})</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">A partir de</span>
                    <span className="font-black text-emerald-700 text-xl">{formatPrice(tour.prices.adult)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}            {filteredTours.length === 0 && (
              <div className="col-span-full py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center flex flex-col items-center">
                <Search className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Nenhuma experiência encontrada</h3>
                <p className="text-gray-500 mt-1">Tente ajustar seus filtros para ver mais resultados.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
};
