import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';

const NavTopPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/80 backdrop-blur-md shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="flex items-center space-x-2"
          >
            <ShoppingBag className="w-8 h-8 text-sky-600" />
            <span className="font-sufrimeda text-4xl font-bold bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent">
              Fabulosa Modas
            </span>
          </a>
          <div className="hidden md:flex items-center space-x-10">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-sky-600 transition font-medium"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('produtos')}
              className="text-gray-700 hover:text-sky-600 transition font-medium"
            >
              Coleção
            </button>
            <button
              onClick={() => scrollToSection('sobre')}
              className="text-gray-700 hover:text-sky-600 transition font-medium"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection('footer')}
              className="text-gray-700 hover:text-sky-600 transition font-medium"
            >
              Contato
            </button>
            <button className="bg-sky-600 text-white px-6 py-3 rounded-full hover:bg-sky-700 transition shadow-lg font-medium">
              Promoções
            </button>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-lg text-gray-700 hover:text-sky-600 font-medium"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('produtos')}
              className="block w-full text-left text-lg text-gray-700 hover:text-sky-600 font-medium"
            >
              Coleção
            </button>
            <button
              onClick={() => scrollToSection('sobre')}
              className="block w-full text-left text-lg text-gray-700 hover:text-sky-600 font-medium"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection('footer')}
              className="block w-full text-left text-lg text-gray-700 hover:text-sky-600 font-medium"
            >
              Contato
            </button>
            <button className="w-full bg-sky-600 text-white py-3 rounded-full hover:bg-sky-700 transition font-medium">
              Ver Promoções
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavTopPage;