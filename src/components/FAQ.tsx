import React, { useRef, useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useScrollAnimation } from '../utils/scrollAnimations';
import DynamicBlobBackground from '../components/DynamicBlobBackground';

const faqs = [
  {
    question: 'What types of businesses can benefit from AI automation?',
    answer: `AI automation works for businesses of all sizes across industries - from retail and healthcare to manufacturing and professional services. Whether you're looking to improve customer service, streamline operations, or enhance decision-making, our solutions adapt to your specific industry needs and challenges.`
  },
  {
    question: 'How long does it take to implement AI automation solutions?',
    answer: `Implementation timelines vary based on project complexity. Simple solutions like chatbots can be deployed in 1-2 weeks, while comprehensive automation systems typically take 4-12 weeks. We provide clear project timelines and keep you updated throughout the entire development process.`
  },
  {
    question: 'Will AI automation replace our employees?',
    answer: `AI automation enhances your team's capabilities rather than replacing jobs. It handles repetitive, time-consuming tasks, allowing your employees to focus on strategic thinking, creativity, and building relationships. Most clients find their teams become more productive and engaged in higher-value work.`
  },
  {
    question: 'How do you ensure our data remains secure with AI systems?',
    answer: `We prioritize data security with enterprise-grade protection including encryption, secure connections, and compliance with privacy regulations like GDPR. All systems are built with robust security measures, and we can integrate with your existing security protocols and requirements.`
  },
  {
    question: 'What kind of support do you provide after implementation?',
    answer: `We offer comprehensive ongoing support including system monitoring, performance optimization, updates, and training for your team. Our solutions are designed to learn and improve over time, and we provide continuous maintenance to ensure optimal performance as your business grows.`
  },
  {
    question: 'Can AI solutions be integrated with existing systems?',
    answer: `Yes, our AI solutions are designed for seamless integration with existing systems. We use standard APIs and protocols to ensure compatibility with your current infrastructure while maintaining data integrity and system performance.`
  }
];

const FAQ: React.FC = () => {
  const { observeElements } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const elementsToAnimate = [
      titleRef.current,
      textRef.current,
      listRef.current
    ].filter(el => el !== null) as HTMLElement[];
    observeElements(elementsToAnimate);
  }, [observeElements]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="py-32 relative bg-black overflow-hidden"
      id="faq"
    >
      <DynamicBlobBackground className="blob-bg-services" />
      <div className="absolute top-0 left-0 w-full h-20 z-10 pointer-events-none bg-gradient-to-b from-black/90 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2
            ref={titleRef}
            className="scroll-animate text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Frequently Asked <span className="dynamic-gradient-text">Questions</span>
          </h2>
          <p
            ref={textRef}
            className="scroll-animate text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Find answers to common questions about our AI solutions and services
          </p>
        </div>

        <div ref={listRef} className="space-y-4 stagger-children scroll-animate max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`unified-card bg-white/5 border border-white/10 rounded-lg overflow-hidden group ${
                openIndex === index ? 'open' : ''
              }`}
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-transparent hover:bg-transparent focus:bg-transparent focus:outline-none"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="flex-1">
                  <span className="text-lg font-medium text-white">
                    {faq.question}
                  </span>
                </div>
                <div className="w-8 h-8 dynamic-gradient-icon rounded-lg flex items-center justify-center card-icon flex-shrink-0 ml-4 transition-transform duration-300 ease-out">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-white transform transition-transform duration-300 ease-out dynamic-gradient-text" />
                  ) : (
                    <Plus className="w-5 h-5 text-white transform transition-transform duration-300 ease-out dynamic-gradient-text" />
                  )}
                </div>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`px-6 overflow-hidden transition-all duration-300 ease-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={openIndex !== index}
              >
                <p className="py-4 text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-20 z-10 pointer-events-none bg-gradient-to-t from-black/90 to-transparent" />
    </section>
  );
};

export default FAQ;
