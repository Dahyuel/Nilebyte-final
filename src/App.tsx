import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { initSmoothScroll } from './utils/smoothScroll';
import './animations.css';
import './styles/buttons.css';
import './styles/faq.css';
import { ChatBotProvider } from './contexts/ChatBotContext';

function App() {
  useEffect(() => {
    // Initialize smooth scrolling
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  return (
    <ChatBotProvider>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </ChatBotProvider>
  );
}

export default App;