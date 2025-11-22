import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import { LOADING_MESSAGES } from '../constants';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500); // Change message every 2.5s

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="relative">
        {/* Animated Circle */}
        <div className="w-24 h-24 border-4 border-indigo-100 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
          <Wand2 className="animate-bounce" size={32} />
        </div>
      </div>

      <h3 className="mt-8 text-2xl font-bold text-gray-800">AI 正在施展魔法</h3>
      <p className="mt-3 text-gray-500 text-lg min-h-[28px] text-center px-4 animate-fade-in transition-all duration-500">
        {LOADING_MESSAGES[msgIndex]}
      </p>
      
      <div className="mt-8 w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 rounded-full animate-loading-bar"></div>
      </div>
      
      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; }
          100% { width: 100%; transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Loader;