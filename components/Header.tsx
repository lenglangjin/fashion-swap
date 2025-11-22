import React from 'react';
import { Sparkles, Shirt } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Shirt size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">AI Fashion Swap</h1>
            <p className="text-xs text-gray-500">智能虚拟试衣间</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          <Sparkles size={16} />
          <span>Powered by Gemini 2.5</span>
        </div>
      </div>
    </header>
  );
};

export default Header;