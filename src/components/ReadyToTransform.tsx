// ReadyToTransform.tsx - Now with DynamicBlobBackground
import React, { useEffect, useRef } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useChatBot } from '../contexts/ChatBotContext';
import DynamicBlobBackground from './DynamicBlobBackground';
import { useScrollAnimation } from '../utils/scrollAnimations';

const ReadyToTransform = () => {
  const { openChat } = useChatBot();
  const { observeElements } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elementsToAnimate = [
        titleRef.current,
        textRef.current,
        buttonsRef.current
    ].filter(el => el !== null) as HTMLElement[];
    observeElements(elementsToAnimate);
  }, [observeElements]);

  return (
    <section id="readytotransform" ref={sectionRef} className="py-32 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 z-10 pointer-events-none bg-gradient-to-b from-black/90 to-transparent" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center">
          <h2 ref={titleRef} className="scroll-animate text-4xl md:text-5xl font-bold mb-6 text-white tracking-wide">
            Ready To Transform
            <br />
            <span className="dynamic-gradient-text">Your Business?</span>
          </h2>
          <p ref={textRef} className="scroll-animate text-lg font-light text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide">
            Let's discuss how AI can revolutionize your operations and drive unprecedented growth for your company.
          </p>
          <div ref={buttonsRef} className="scroll-animate flex flex-col sm:flex-row gap-4 justify-center items-center stagger-children">
            <button
              onClick={() => openChat('Book A Call')}
              className="premium-button w-full sm:w-auto px-6 py-4 gradient-cta-btn text-white font-normal flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Phone className="w-5 h-5 mr-1" />
              Book A Call
            </button>
            <button
              onClick={() => openChat()}
              className="premium-button w-full sm:w-auto px-6 py-4 white-cta-btn text-white font-normal flex items-center justify-center gap-2 text-sm sm:text-base chat-bot-hover"
            >
              <MessageCircle className="w-5 h-5 mr-1" />
              Chat With Our Bot
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-20 z-10 pointer-events-none bg-gradient-to-t from-black/90 to-transparent" />
    </section>
  );
};

export default ReadyToTransform;