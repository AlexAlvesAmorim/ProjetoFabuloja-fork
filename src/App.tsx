import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { ProductCatalog } from './components/sections/ProductCatalog';
import { AdminApp } from './components/admin/AdminApp';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const desktop = new Image();
    const mobile = new Image();
    desktop.src = '/manvitrine/showcaseimg-desktop.webp';
    mobile.src = '/manvitrine/showcaseimg-mobile.webp';

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
            Nós somos a{' '}
          </h3>
          <h1 className="font-sufrimeda text-center text-7xl md:text-9xl font-extrabold bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent animate-pulse tracking-tight">
            Fabulosa Modas
          </h1>
          <p className="text-2xl text-gray-700 mt-8 animate-pulse">Seja bem vindo...</p>
          <div className="mt-12 w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-600 to-cyan-500 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      )}
      <div className={`transition-all duration-1000 ${isLoading ? 'blur-sm' : 'blur-0'}`}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Hero />
                  <About />
                  <ProductCatalog />
                  <Footer />
                </>
              }
            />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
