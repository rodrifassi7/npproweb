import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import PackBuilder from './pages/PackBuilder';
import Checkout from './pages/Checkout';
import MacrosPage from './pages/MacrosCalculator';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import FloatingWhatsAppButton from './components/common/FloatingWhatsAppButton';

import LocalSeo from './pages/LocalSeo';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <PageWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/packs" element={<PackBuilder />} />
              <Route path="/macros" element={<MacrosPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/viandas-en-trelew" element={<LocalSeo />} />
            </Routes>
          </PageWrapper>
        </main>
        <FloatingWhatsAppButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
