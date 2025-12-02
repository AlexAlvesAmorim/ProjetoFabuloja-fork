import HeroPage from './components/HeroPage';
import MainLandingPage from './components/MainLandingPage';
import NavTopPage from './components/NavTopPage';
import FooterPage from './components/FooterPage';
import AboutPage from './components/AboutPage';


function App() {
  return (
    <div className="app">
      <NavTopPage />
        <HeroPage />
          <AboutPage />
            <MainLandingPage /> 
              <FooterPage />
    </div>
  );
}

export default App;


/* APLICAR AS CORES DO PROJETO AZUL, REMOVER O ROSA (TALVEZ).

A TELA INICIAL COM A LETRA BRANCA NÃO ESTÁ LEGAL. ESPAÇAMENTO ? TALVEZ ! 

APLICAR A FUNCIONALIDADE MODA MASCULINA E MODA FEMININA ! TALVEZ CLICAR EM MUDAR DE COR ?

AJEITAR O ZOOM DAS IMAGENS, TEM ALGUMAS COM MUITO ZOOM !! */