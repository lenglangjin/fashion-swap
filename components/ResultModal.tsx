import React from 'react';
import { X, Download, Share2, RefreshCw } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultUrl: string | null;
  personUrl: string | null;
  garmentUrl: string | null;
  onRetry: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ 
  isOpen, 
  onClose, 
  resultUrl, 
  personUrl, 
  garmentUrl,
  onRetry
}) => {
  if (!isOpen || !resultUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-xl font-bold text-gray-800">✨ 试穿结果</h2>
          <div className="flex items-center gap-2">
             <button 
              onClick={onRetry}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
              title="重试"
            >
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Left: Inputs (Small) */}
            <div className="flex flex-col gap-4 lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">原始输入</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <img src={personUrl || ''} className="w-full h-full object-cover" alt="Person" />
                    <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 rounded">人物</span>
                  </div>
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <img src={garmentUrl || ''} className="w-full h-full object-cover" alt="Garment" />
                    <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 rounded">服装</span>
                  </div>
                </div>
              </div>
              
               <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-sm text-indigo-800">
                 <p>💡 提示：AI 生成结果仅供参考。如果对细节不满意，尝试更换更清晰的图片并重新生成。</p>
               </div>
            </div>

            {/* Right: Result (Large) */}
            <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col h-full">
              <div className="relative flex-grow bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group">
                <img 
                  src={resultUrl} 
                  alt="Generated Result" 
                  className="w-full h-full object-contain bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-100"
                />
                
                {/* Floating Actions */}
                <div className="absolute bottom-6 right-6 flex gap-3">
                  <a 
                    href={resultUrl} 
                    download="ai-fashion-swap.png"
                    className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-transform hover:-translate-y-1 font-medium"
                  >
                    <Download size={18} />
                    保存图片
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultModal;