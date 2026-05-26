import { MapPin, Mail, Phone, Share2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 text-emerald-500 mb-4">
            <MapPin className="w-6 h-6" />
            <span className="text-xl font-black text-white">Bu Country Tours</span>
          </div>
          <p className="text-sm leading-relaxed">
            Descubra o mundo com as melhores experiências locais. Planejamos cada detalhe para que sua viagem seja inesquecível.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-widest">Explorar</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Tours Populares</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Novidades</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Dicas de Viagem</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-widest">Contato</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> oi@bucountry.com</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +351 210 000 000</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-widest">Siga-nos</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-gray-800 pt-8 text-center text-sm">
        <p>© 2026 Bu Country Tours. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};
