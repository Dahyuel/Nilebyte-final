import React, { useEffect, useRef } from 'react';
import { useScrollAnimation } from '../utils/scrollAnimations';

const About = () => {
  const { observeElements } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elementsToAnimate = [
        titleRef.current,
        textRef.current,
        videoRef.current
    ].filter(el => el !== null) as HTMLElement[];
    observeElements(elementsToAnimate);
  }, [observeElements]);

  return (
    <section id="about" ref={sectionRef} className="py-32 relative bg-black">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 ref={titleRef} className="scroll-animate text-4xl md:text-5xl font-bold mb-6 text-white">
            About <span className="dynamic-gradient-text">Us</span>
          </h2>
          <p ref={textRef} className="scroll-animate text-base font-light text-gray-400 max-w-3xl mx-auto leading-relaxed tracking-wide">
            We are a dedicated team of AI experts, data scientists, and engineers. We leverage our deep expertise to build and integrate custom automation solutions that solve your most complex business challenges and drive measurable growth.
          </p>
        </div>

        <div ref={videoRef} className="scroll-animate max-w-4xl mx-auto pb-8">
          <div className="relative rounded-2xl overflow-hidden p-1" style={{
            background: 'linear-gradient(45deg, #0052D4, #4364F7, #6FB1FC, #0052D4, #4364F7)',
            backgroundSize: '300% 300%',
            animation: 'gradient-shift 2.5s ease infinite',
            borderRadius: '1rem'
          }}>
            <div className="bg-black rounded-xl overflow-hidden">
              <div style={{padding:'56.25% 0 0 0', position:'relative'}}>
                <iframe 
                  src="https://player.vimeo.com/video/1104451607?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&controls=1&sidedock=0&speed=0&quality=1&pip=0&volume=1&color=ffffff&transparent=0" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}} 
                  title="Nilebyte About Us Ad"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <script src="https://player.vimeo.com/api/player.js"></script>
    </section>
  );
};

export default About;