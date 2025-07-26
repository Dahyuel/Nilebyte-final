import React, { useEffect, useRef, useState } from 'react';
import DynamicBlobBackground from './DynamicBlobBackground';
import { useScrollAnimation } from '../utils/scrollAnimations';
import { Phone, MessageSquare, Share2, Code, Settings } from 'lucide-react';

const servicesData = [
  {
    icon: Phone,
    title: 'AI Voice Agents',
    description: 'Intelligent voice assistants that handle inbound calls, qualify leads, book appointments, and provide 24/7 customer support with natural speech recognition and human-like responses.'
  },
  {
    icon: MessageSquare,
    title: 'AI Chatbots',
    description: 'Smart conversational bots that engage website visitors, answer customer inquiries, capture leads, and provide instant support across multiple platforms and messaging channels.'
  },
  {
    icon: Share2,
    title: 'AI Social Media Agents',
    description: 'Automated social media managers that respond to DMs, WhatsApp messages, Facebook comments, engage with followers, and maintain consistent brand presence across all platforms.'
  },
  {
    icon: Code,
    title: 'Smart Development',
    description: 'AI-enhanced websites and applications that adapt to user behavior, personalize content, optimize performance, and provide intelligent user experiences for maximum engagement.'
  },
  {
    icon: Settings,
    title: 'AI-Driven Automations',
    description: 'Custom workflow automation solutions that streamline business operations, process data intelligently, manage tasks, and eliminate repetitive work to boost productivity and efficiency.'
  }
];

const Services = () => {
  const { observeElements } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const animationRef = useRef<number | null>(null);
  const CARD_WIDTH = 400;
  const CARD_COUNT = 5;
  const SLIDER_WIDTH = CARD_WIDTH * CARD_COUNT;
  const SPEED = 1.33; // px per frame, ~30s for full loop

  useEffect(() => {
    const elementsToAnimate = [
      titleRef.current,
      textRef.current,
      sliderRef.current
    ].filter(el => el !== null) as HTMLElement[];
    observeElements(elementsToAnimate);
  }, [observeElements]);

  useEffect(() => {
    function animate() {
      setOffset(prev => {
        let next = prev - SPEED;
        if (next <= -SLIDER_WIDTH) {
          next += SLIDER_WIDTH;
        }
        return next;
      });
      animationRef.current = requestAnimationFrame(animate);
    }
    if (!isPaused) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPaused]);

  return (
    <section id="services" ref={sectionRef} className="py-20 relative bg-black overflow-hidden">
      <DynamicBlobBackground className="blob-bg-services" />
      <div className="absolute top-0 left-0 w-full h-20 z-10 pointer-events-none bg-gradient-to-b from-black/90 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-20 z-10 pointer-events-none bg-gradient-to-t from-black/90 to-transparent" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 ref={titleRef} className="scroll-animate text-4xl md:text-5xl font-bold mb-6 text-white tracking-wide">
            AI-Powered Services for
            <br />
            <span className="dynamic-gradient-text">Future-Driven Businesses</span>
          </h2>
          <p ref={textRef} className="scroll-animate text-base font-light text-gray-400 max-w-3xl mx-auto leading-relaxed tracking-wide">
            Our cutting-edge AI solutions are designed to transform businesses, enhance efficiency, and drive innovation.
          </p>
        </div>

        {/* Desktop Slider */}
        <div ref={sliderRef} className="scroll-animate relative hidden md:block" style={{overflow: 'visible'}}>
          <div
            className="flex gap-6"
            style={{
              width: 'calc(400px * 10)',
              transform: `translateX(${offset}px)`,
              transition: isPaused ? 'none' : undefined
            }}
          >
            {/* First set of cards */}
            {servicesData.map((service, index) => (
              <div
                key={index}
                className="unified-card p-8 bg-white/5 border border-white/10 rounded-2xl group flex-shrink-0 w-80 card-hover-effect"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 card-icon dynamic-gradient-icon">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white tracking-wide">{service.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed tracking-wide">{service.description}</p>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {servicesData.map((service, index) => (
              <div
                key={`duplicate-${index}`}
                className="unified-card p-8 bg-white/5 border border-white/10 rounded-2xl group flex-shrink-0 w-80 card-hover-effect"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 card-icon dynamic-gradient-icon">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white tracking-wide">{service.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed tracking-wide">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Grid */}
        <div className="md:hidden grid gap-6 max-w-sm mx-auto stagger-children scroll-animate">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="unified-card p-6 bg-white/5 border border-white/10 rounded-2xl group"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 card-icon dynamic-gradient-icon">
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white tracking-wide">{service.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed tracking-wide text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .card-hover-effect {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover-effect:hover {
          transform: scale(1.08) rotate(-2deg) translateZ(0);
          z-index: 10;
        }
      `}</style>
    </section>
  );
};

export default Services;