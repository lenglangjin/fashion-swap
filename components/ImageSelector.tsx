import React, { useRef } from 'react';
import { Upload, CheckCircle, Ban, Laptop, Cable, Smartphone, Monitor } from 'lucide-react';
import { ImageAsset, GarmentCategory, ProductCategory } from '../types';

interface ImageSelectorProps {
  title: string;
  selectedImage: string | null;
  defaultOptions: ImageAsset[];
  onSelect: (url: string | null) => void;
  type: 'person' | GarmentCategory | ProductCategory;
  allowClear?: boolean;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  title,
  selectedImage,
  defaultOptions,
  onSelect,
  type,
  allowClear = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onSelect(url);
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'person': return '👤';
      case 'top': return '👕';
      case 'bottom': return '👖';
      case 'accessory': return '🕶️';
      case 'computer': return <Laptop size={14} className="inline mr-1"/>;
      case 'cable': return <Cable size={14} className="inline mr-1"/>;
      case 'phone': return <Smartphone size={14} className="inline mr-1"/>;
      default: return '🖼️';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Compact Header */}
      <div className="px-3 py-2 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <span className="flex items-center justify-center">{getIcon()}</span>
          {title}
        </h3>
        {allowClear && selectedImage && (
          <button 
            onClick={() => onSelect(null)}
            className="text-[10px] text-red-500 hover:bg-red-50 px-2 py-1 rounded-full transition-colors flex items-center gap-1"
          >
            <Ban size={10} /> 清除
          </button>
        )}
      </div>

      <div className="p-3 flex-grow flex flex-col gap-3">
        {/* Main Preview - Compact */}
        <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-200 group hover:border-indigo-300 transition-colors">
          {selectedImage ? (
            <>
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
              >
                更换图片
              </button>
            </>
          ) : (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1.5 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Upload size={14} />
              </div>
              <span className="text-xs font-medium">上传</span>
            </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Quick Select */}
        <div>
          <div className="grid grid-cols-3 gap-1.5">
             {/* Optional "Empty" block if allowClear is true */}
             {allowClear && (
              <button
                onClick={() => onSelect(null)}
                className={`relative aspect-square rounded overflow-hidden border transition-all flex flex-col items-center justify-center bg-gray-50 ${
                  selectedImage === null 
                    ? 'border-indigo-600 ring-1 ring-indigo-100 text-indigo-600' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-400'
                }`}
              >
                <Ban size={16} />
                <span className="text-[10px] mt-1">无</span>
              </button>
            )}

            {defaultOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onSelect(option.url)}
                className={`relative aspect-square rounded overflow-hidden border transition-all ${
                  selectedImage === option.url 
                    ? 'border-indigo-600 ring-1 ring-indigo-100' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img 
                  src={option.url} 
                  alt={option.label}
                  className="w-full h-full object-cover"
                />
                {selectedImage === option.url && (
                  <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                    <CheckCircle className="text-white drop-shadow-md" size={12} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;