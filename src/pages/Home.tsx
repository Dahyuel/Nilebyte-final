import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import ReadyToTransform from '../components/ReadyToTransform';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import '../styles/animations.css';
import { useLocation } from 'react-router-dom';

function Home() {
  const location = useLocation();

  useEffect(() => {
    // Only keep scroll to top functionality
    window.scrollTo(0, 0);
    // Scroll to section if scrollTo state is present
    const scrollTo = location.state && (location.state as any).scrollTo;
    if (scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      <div className="relative z-10">
        <Navigation />
        <main>
          <Hero />
          <About />
          <Services />
          <Pricing />
          <FAQ />
          <ReadyToTransform />
          <Contact />
        </main>
        <Footer />
        <ChatBot />
      </div>
    </div>
  );
}

export default Home;