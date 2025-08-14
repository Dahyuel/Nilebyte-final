import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { useScrollAnimation } from '../utils/scrollAnimations';
import { useChatBot } from '../contexts/ChatBotContext';

const pricingPlans = [
  {
    name: 'Basic',
    price: '12,000 EGP',
    period: 'OTP',
    features: [
      'Custom AI-ready website',
      '1-year hosting setup',
      'Mobile-friendly, fast & secure'
    ],
    popular: false
  },
  {
    name: 'Standard',
    price: '5,775 EGP',
    period: 'Monthly + OTP',
    features: [
      'AI-ready website + hosting',
      'Social Media Agent (FB-IG-WP)',
      'Auto-replies, lead capture & engagement'
    ],
    popular: false
  },
  {
    name: 'Premium',
    price: '8,000 EGP',
    period: 'Monthly + OTP',
    features: [
      'Social Media Agent + Voice Agent',
      '500 voice minutes + 1,000 WhatsApp messages',
      'Auto-replies, lead capture & engagement'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '9,000 EGP',
    period: 'Monthly + OTP',
    features: [
      'AI-ready website + hosting',
      'Social Media Agent + Voice Agent',
      '500 voice minutes + 1,000 WhatsApp messages',
      'Auto-replies, lead capture & engagement'
    ],
    popular: false
  }
];

const Pricing = () => {
  const { openChat } = useChatBot();
  const { observeElements } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elementsToAnimate = [
      titleRef.current,
      textRef.current,
      cardsRef.current
    ].filter(el => el !== null) as HTMLElement[];
    observeElements(elementsToAnimate);
  }, [observeElements]);

  return (
    <section id="pricing" ref={sectionRef} className="py-32 relative bg-black overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 ref={titleRef} className="scroll-animate text-4xl md:text-5xl font-bold mb-6 text-white tracking-wide">
            Choose Your <span className="dynamic-gradient-text">AI Plan</span>
          </h2>
          <p ref={textRef} className="scroll-animate text-base font-light text-gray-400 max-w-3xl mx-auto leading-relaxed tracking-wide">
            Select the perfect AI automation package for your business needs and start transforming your operations today.
          </p>
        </div>

        <div ref={cardsRef} className="scroll-animate grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto stagger-children">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`unified-card relative p-8 bg-white/5 border border-white/10 rounded-2xl group ${
                plan.popular ? 'ring-2 ring-blue-400/50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#0052D4] via-[#4364F7] to-[#6FB1FC] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold dynamic-gradient-text">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 dynamic-gradient-icon flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm font-light leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openChat(`I'm interested in the ${plan.name} plan`)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                  plan.popular
                    ? 'gradient-cta-btn text-white'
                    : 'white-cta-btn text-white'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;