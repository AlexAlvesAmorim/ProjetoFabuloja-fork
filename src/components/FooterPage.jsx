import React from "react";
import { ShoppingBag, Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter } from "lucide-react";

const FooterPage = () => {
  return (
    <footer id="footer" className="bg-gradient-to-b from-gray-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <ShoppingBag className="w-12 h-12 text-sky-500" />
            <h2 className="font-sufrimeda text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent">
              Fabulosa Modas
            </h2>
          </div>
          <p className="text-xl text-gray-400">Entre em Contato</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 justify-items-center">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-9 border border-white/10 hover:border-sky-500/30 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Mail className="w-7 h-7 text-sky-500" />
              Contato
            </h3>
            <div className="text-left space-y-4 text-gray-300">
              <p className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-400" />
                (21) 99999-8888
              </p>
                <p className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sky-500" />
                contato@fabulosamodas
              </p>
              <p className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-sky-400" />
                Rua Josué, 0000 - Cidade de Deus, RJ
              </p>

              <div className="">
            <h3 className="text-2xl font-bold mb-6">Siga-nos</h3>
            <div className="flex justify-center gap-6">
              <a
                href="#"
                className="w-14 h-14 bg-rose-600/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-sky-600 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
                aria-label="Instagram"
              >
                <Instagram className="w-7 h-7 text-rose-400" />
              </a>
              <a
                href="#"
                className="w-14 h-14 bg-cyan-600/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-sky-600 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
                aria-label="Facebook"
              >
                <Facebook className="w-7 h-7 text-cyan-400" />
              </a>
              <a
                href="#"
                className="w-14 h-14 bg-rose-600/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-rose-600 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
                aria-label="Twitter"
              >
                <Twitter className="w-7 h-7 text-rose-400" />
              </a>
            </div>
          </div>

            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-sky-500/30 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Clock className="w-7 h-7 text-sky-500" />
              Horário de Funcionamento
            </h3>
            <div className="space-y-4 text-gray-300">
              <p>Segunda a Sexta: 10h às 21h</p>
              <p>Sábado: 10h às 19h</p>
              <p className="text-sky-400 font-bold text-lg">
                Domingo: Descanso merecido!
              </p>
            </div>
          </div>
        </div>
        <div className="text-center pt-12 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            © Desenvolvido por Alex Alves. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Canal EstudanteDev
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;