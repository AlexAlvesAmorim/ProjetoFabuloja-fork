import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroPage from './components/HeroPage';
import MainLandingPage from './components/MainLandingPage';
import AboutPage from './components/AboutPage';
import NavTopPage from './components/NavTopPage';
import FooterPage from './components/FooterPage';


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const desktop = new Image();
    const mobile = new Image();
    desktop.src = "/manvitrine/showcaseimg-desktop.webp";
    mobile.src = "/manvitrine/showcaseimg-mobile.webp";

    const checkLoaded = () => {
      if (desktop.complete && mobile.complete) {
        setTimeout(() => setIsLoading(false), 950);
      }
    };

    desktop.onload = checkLoaded;
    mobile.onload = checkLoaded;

    checkLoaded();

  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 z-[9999] flex flex-col items-center justify-center">
          <h3 className="text-center text-3xl md:text-3xl font-extrabold bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent animate-pulse tracking-tight">
            Nós somos a </h3>
          <h1 className="font-sufrimeda text-center text-7xl md:text-9xl font-extrabold bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent animate-pulse tracking-tight">
            Fabulosa Modas
          </h1>
          <p className="text-2xl text-gray-700 mt-8 animate-pulse">
            Seja bem vindo...
          </p>
          <div className="mt-12 w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-600 to-cyan-500 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      )}
      <div className={`transition-all duration-1000 ${isLoading ? "blur-sm" : "blur-0"}`}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <NavTopPage />
                  <HeroPage />
                  <AboutPage />
                  <MainLandingPage />
                  <FooterPage />
                </>
              }
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;

// TALVEZ ESTEJA NA HORA DE RESOLVER O BACKEND ??? (TALVEZ ??)
// CRIAR UMA BARRA DE ROLAMENTO E PAGINAÇÃO ? (INTERESSANTE ! TALVEZ PRIORIDADE!)
// NAS LATERAIS, TALVEZ, COLOCAR ALGUM GIF OU VIDEO DE MODELOS ? (DAR MAIS VIDA ???)

// QUANDO ENTRA NA TELA O NAVTOPPAGE fica fora do container (RESOLVER)