import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import FloatingWhatsAppButton from './components/common/FloatingWhatsAppButton';

// Cada página se descarga recién cuando alguien entra a ella.
const Menu = lazy(() => import('./pages/Menu'));
const PackBuilder = lazy(() => import('./pages/PackBuilder'));
const Checkout = lazy(() => import('./pages/Checkout'));
const MacrosPage = lazy(() => import('./pages/MacrosCalculator'));
const LocalSeo = lazy(() => import('./pages/LocalSeo'));
const GymLanding = lazy(() => import('./pages/GymLanding'));

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Fundido de entrada en CSS: no frena el cambio de página esperando una animación de salida.
  return <div key={location.pathname} className="page-enter">{children}</div>;
};

const PageFallback = () => <div className="min-h-[100svh] bg-[#0B0B0B]" aria-busy="true" />;

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <PageWrapper>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/packs" element={<PackBuilder />} />
                <Route path="/macros" element={<MacrosPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/viandas-en-trelew" element={<LocalSeo />} />
                <Route path="/gym" element={<GymLanding />} />
              </Routes>
            </Suspense>
          </PageWrapper>
        </main>
        <FloatingWhatsAppButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
