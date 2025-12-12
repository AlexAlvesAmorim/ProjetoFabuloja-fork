import React, { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const irParaColecao = (aba) => {
    navigate(`?aba=${aba}`, { replace: false });

    setTimeout(() => {
      document.getElementById('produtos')?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 100);
  };

  useEffect(() => {
    const images = [
      "/manvitrine/showcaseimg-desktop.webp",
      "/manvitrine/showcaseimg-mobile.webp"
    ];

    let loadedImages = 0;
    const totalImages = images.length;

    const imageLoadHandler = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        setIsLoaded(true);
      }
    };

    images.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = imageLoadHandler;
      img.onerror = imageLoadHandler;
    });

    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  return (
    <section
      id="home"
      className={`relative min-h-screen flex flex-col justify-center items-center text-center transition-opacity duration-1000 mt-20 md:mt-24 ${isLoaded ? "opacity-100" : "opacity-0"
        }`}
    >
      <picture className="absolute inset-0 -z-10">
        <source media="(min-width: 768px)" srcSet="/manvitrine/showcaseimg-desktop.webp" />
        <img
          src="/manvitrine/showcaseimg-mobile.webp"
          alt="Vitrine Fabulosa Modas"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
      </picture>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent -z-10"></div>

      <div className="relative z-10 px-6 max-w-5xl mx-auto">
        <h1 className="font-sufrimeda text-7xl md:text-7xl lg:text-9xl font-extrabold bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent mb-8 tracking-tight drop-shadow-2xl ">
          Fabulosa Modas
        </h1>

        <p className="text-xl md:text-3xl lg:text-4xl text-gray-100 font-light mb-12 max-w-3xl mx-auto drop-shadow-lg">
          Descubra o melhor estilo para você.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <button
            onClick={() => irParaColecao("masculina")}
            className="group relative overflow-hidden px-12 py-6 rounded-full text-xl font-bold text-slate-900 bg-gradient-to-r from-sky-400 via-teal-400 to-sky-400 bg-[length:200%_auto] transition-all duration-500 hover:bg-right-center hover:shadow-2xl hover:scale-110 active:scale-95 shadow-2xl"
          >
            <span className="relative z-10 drop-shadow">Ir para Coleção Masculina</span>
          </button>

          <button
            onClick={() => irParaColecao("feminina")}
            className="group relative overflow-hidden px-12 py-6 rounded-full text-xl font-bold text-slate-900 bg-gradient-to-r from-sky-400 via-teal-400 to-sky-400 bg-[length:200%_auto] transition-all duration-500 hover:bg-right-center hover:shadow-2xl hover:scale-110 active:scale-95 shadow-2xl"
          >
            <span className="relative z-10 drop-shadow">Ir para Coleção Feminina</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
        <ArrowDown className="w-14 h-14 drop-shadow-2xl" />
      </div>
    </section>
  );
};

export default HeroPage;