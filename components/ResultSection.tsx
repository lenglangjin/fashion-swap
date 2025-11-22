import React, { useState, useEffect } from 'react';
import { Download, Sparkles, AlertCircle, Wand2 } from 'lucide-react';
import { LOADING_MESSAGES } from '../constants';

interface ResultSectionProps {
  isLoading: boolean;
  resultUrl: string | null;
  error: string | null;
}

const ResultSection: React.FC<ResultSectionProps> = ({ isLoading, resultUrl, error }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full min-h-[500px] relative">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-50 bg-white/80 backdrop-blur-sm absolute top-0 left-0 right-0 z-20 flex justify-between items-center shadow-sm">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="text-amber-400 fill-amber-400" size={18} />
            生成结果
          </h3>
          {resultUrl && !isLoading && (
            <a 
              href={resultUrl} 
              download="ai-fashion-swap.png"
              className="flex items-center gap-2 text-xs font-medium text-white bg-black px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors shadow-md"
            >
              <Download size={14} />
              下载原图
            </a>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-grow bg-[#f8fafc] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative flex items-center justify-center overflow-hidden p-6">
          
          {/* 1. Empty State */}
          {!isLoading && !resultUrl && !error && (
            <div className="text-center max-w-xs mx-auto text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-5 flex items-center justify-center shadow-inner">
                <Wand2 size={32} className="text-gray-300" />
              </div>
              <h4 className="text-lg font-semibold text-gray-600 mb-1">准备就绪</h4>
              <p className="text-sm">请在左侧选择素材，点击生成</p>
            </div>
          )}

          {/* 2. Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center text-center px-6">
              <div className="relative mb-6 scale-90">
                <div className="w-20 h-20 border-4 border-indigo-100 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                  <Sparkles className="animate-bounce" size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">AI 处理中</h3>
              <p className="text-sm text-gray-500 animate-pulse max-w-[200px] mx-auto">{LOADING_MESSAGES[msgIndex]}</p>
              <div className="mt-6 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full animate-loading-bar"></div>
              </div>
            </div>
          )}

          {/* 3. Error State */}
          {error && !isLoading && (
             <div className="text-center max-w-md mx-auto text-red-500 bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm">
              <AlertCircle size={32} className="mx-auto mb-3" />
              <h4 className="text-base font-semibold mb-1">生成失败</h4>
              <p className="text-xs opacity-80">{error}</p>
            </div>
          )}

          {/* 4. Result Image - Optimized Size */}
          {resultUrl && !isLoading && (
            <div className="relative w-full h-full flex items-center justify-center">
               <img 
                src={resultUrl} 
                alt="Generated Result" 
                className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-xl animate-in fade-in zoom-in duration-500 border-4 border-white"
                style={{
                  maxWidth: '450px', // Limit width on large screens so it's not huge
                }}
              />
            </div>
          )}
        </div>
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

export default ResultSection;