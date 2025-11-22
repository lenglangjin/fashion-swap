import React from 'react';
import { Palette, Layers } from 'lucide-react';
import { AttributeOption } from '../types';

interface AttributeSelectorProps {
  colors: AttributeOption[];
  materials: AttributeOption[];
  selectedColor: string;
  selectedMaterial: string;
  onColorChange: (id: string) => void;
  onMaterialChange: (id: string) => void;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  colors,
  materials,
  selectedColor,
  selectedMaterial,
  onColorChange,
  onMaterialChange
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-5 h-full">
      <div className="border-b border-gray-50 pb-2">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Palette size={20} className="text-purple-500" />
          自定义样式
        </h3>
        <p className="text-xs text-gray-400">可选：修改服装的颜色与材质</p>
      </div>

      {/* Color Selection */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
          颜色
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const isSelected = selectedColor === color.id;
            const isOriginal = color.id === 'original';
            return (
              <button
                key={color.id}
                onClick={() => onColorChange(color.id)}
                title={color.label}
                className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110
                  ${isSelected 
                    ? 'border-indigo-600 ring-2 ring-indigo-100 scale-110' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                style={{ backgroundColor: isOriginal ? 'transparent' : color.preview }}
              >
                {isOriginal && (
                  <span className="text-[10px] font-medium text-gray-500">原色</span>
                )}
                {isSelected && !isOriginal && (
                  <div className={`w-2 h-2 rounded-full ${['white', 'yellow'].includes(color.id) ? 'bg-gray-800' : 'bg-white'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Material Selection */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
          <Layers size={14} />
          材质
        </label>
        <div className="flex flex-wrap gap-2">
          {materials.map((material) => {
            const isSelected = selectedMaterial === material.id;
            return (
              <button
                key={material.id}
                onClick={() => onMaterialChange(material.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                  ${isSelected
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {material.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttributeSelector;
