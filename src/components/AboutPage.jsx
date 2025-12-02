import React from "react";
import { Heart, Sparkles, Star, Users } from "lucide-react";

const AboutPage = () => {
  return (
    <section id="sobre" className="py-24 bg-gradient-to-b from-white to-rose-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-20">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Mais do que moda,<br />
              <span className=" text-sky-400">é atitude</span>
            </h2>
            <p className="text-xl md:text-2xl font-light max-w-3xl">
              Desde 2020 transformando looks com peças únicas e estilo que reflete quem você é.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12  text-sky-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Paixão pela Moda</h3>
            <p className="text-gray-600">
              Cada peça é escolhida com carinho para trazer o melhor estilo até você.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12  text-sky-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Estilo Único</h3>
            <p className="text-gray-600">
              Peças que combinam tendência, conforto e personalidade. Você no centro.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12  text-sky-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Comunidade</h3>
            <p className="text-gray-600">
              Uma família de pessoas que amam se expressar através da moda.
            </p>
          </div>
        </div>

        <div className="text-center mt-20 max-w-4xl mx-auto">
          <p className="text-2xl md:text-3xl font-light text-gray-700 leading-relaxed">
            Na <span className="font-sufrimeda font-bold bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent">Fabulosa Modas</span>, acreditamos que
            <span className="block text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              Moda não é só roupa — é quem você decide ser hoje.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;