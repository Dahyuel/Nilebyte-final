import React from 'react';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {/* Dark overlay */}
      <div className="absolute inset-0 w-full h-full bg-black/70 z-10" />
      
      {/* Fallback gradient background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0052D4] via-[#4364F7] to-[#6FB1FC] opacity-[0.12]" />
      
      {/* Spline Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <iframe
          src="https://my.spline.design/animatedbackgroundgradientforweb-oGIS27vhDLOszct4TtlhOm7q/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full opacity-50"
          style={{ pointerEvents: 'none' }}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground; 