import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus('');
    if (!subName.trim() || !subEmail.trim()) {
      setSubStatus('Please enter your name and email.');
      return;
    }
    try {
      const res = await fetch('https://hook.eu2.make.com/2wrxs3a6ls4yyg6139mryinuusxvbknp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: subName, email: subEmail })
      });
      if (res.ok) {
        setSubStatus('Thank you for subscribing!');
        setSubName('');
        setSubEmail('');
      } else {
        setSubStatus('Subscription failed. Please try again.');
      }
    } catch {
      setSubStatus('Subscription failed. Please try again.');
    }
  };

  const scrollToSection = (sectionId: string) => {
    // If we're not on the homepage, navigate there with state for the section
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }

    // If we're already on the homepage, just scroll
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSocialClick = (platform: string) => {
    const socialLinks = {
      'Twitter(X)': '#',
      'Instagram': 'https://www.instagram.com/nilebyte.ai',
      'LinkedIn': '#'
    };
    
    const url = socialLinks[platform as keyof typeof socialLinks];
    if (url !== '#') {
      openLink(url);
    }
  };

  return (
    <footer className="py-10 border-t border-white/10 relative bg-black">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold tracking-wider text-white mb-3">NileByte</h3>
            <p className="text-gray-400 font-light leading-relaxed tracking-wide mb-3 max-w-sm text-sm">
              Building the future with AI-powered solutions
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-white font-semibold mb-3 tracking-wide text-sm">Pages</h3>
            <ul className="space-y-1.5">
              {['home', 'about', 'services', 'contact', 'faq'].map((section) => (
                <li key={section}>
                  <button 
                    onClick={() => scrollToSection(section)} 
                    className="footer-link text-gray-400 hover:text-white font-light tracking-wide relative py-0.5 px-0 rounded transition-colors duration-200 block text-left text-sm"
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-3 tracking-wide text-sm">Social</h3>
            <ul className="space-y-1.5">
              {['Facebook', 'Instagram', 'LinkedIn'].map((platform) => (
                <li key={platform}>
                  <button 
                    onClick={() => handleSocialClick(platform)}
                    className="footer-link text-gray-400 hover:text-white font-light tracking-wide py-0.5 px-0 rounded transition-colors duration-200 block text-left text-sm"
                  >
                    {platform}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe Form */}
          <div>
            <h3 className="text-white font-semibold mb-3 tracking-wide text-sm">Subscribe Form</h3>
            <form className="flex flex-col space-y-4" onSubmit={handleSubscribe}>
              <input
                type="text"
                placeholder="Enter Your Name..."
                value={subName}
                onChange={e => setSubName(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300 font-light text-sm"
              />
              <input
                type="email"
                placeholder="Enter Your Email..."
                value={subEmail}
                onChange={e => setSubEmail(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300 font-light text-sm"
              />
              <button type="submit" className="premium-button px-6 py-2 gradient-cta-btn text-white font-normal text-sm">
                <span className="text-white">Subscribe</span>
              </button>
              {subStatus && <div className="text-xs text-center text-gray-300 mt-1">{subStatus}</div>}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-white/5">
          <p className="text-gray-400 font-light tracking-wide text-xs">
            © 2024 Nilebyte
          </p>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <button 
              onClick={() => openLink('https://drive.google.com/file/d/1kGjcRMzJj_wOlWLJJxHzQ22GDhvn4KGu/view?usp=sharing')}
              className="footer-link text-gray-400 hover:text-white font-light tracking-wide text-xs px-2 py-0.5 rounded transition-colors duration-200"
            >
              Terms & Conditions
            </button>
            <button 
              onClick={() => openLink('https://drive.google.com/file/d/1f-CviNxaUSM91vV6i8UZx-SXjiya6sjy/view?usp=sharing')}
              className="footer-link text-gray-400 hover:text-white font-light tracking-wide text-xs px-2 py-0.5 rounded transition-colors duration-200"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;