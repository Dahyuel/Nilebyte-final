import React from 'react';
import './DynamicBlobBackground.css';

interface DynamicBlobBackgroundProps {
  className?: string;
}

const DynamicBlobBackground: React.FC<DynamicBlobBackgroundProps> = ({ className = '' }) => (
  <div className={`absolute inset-0 w-full h-full z-0 pointer-events-none ${className}`}>
    {/* Layer 1 */}
    <div className="blob blob1" />
    {/* Layer 2 */}
    <div className="blob blob2" />
    {/* Layer 3 */}
    <div className="blob blob3" />
  </div>
);

export default DynamicBlobBackground; 