// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroPage from './components/HeroPage';
import MainLandingPage from './components/MainLandingPage';
import AboutPage from './components/AboutPage';
import NavTopPage from './components/NavTopPage';
import FooterPage from './components/FooterPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <NavTopPage />
                <AboutPage />
                <HeroPage />
                <MainLandingPage />
                <FooterPage />
                
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;