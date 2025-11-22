import React, { useState } from 'react';
import { Wand2, Shirt, Scissors, Glasses, Monitor, Cable, Smartphone, Layers } from 'lucide-react';
import Header from './components/Header';
import ImageSelector from './components/ImageSelector';
import AttributeSelector from './components/AttributeSelector';
import ResultSection from './components/ResultSection';
import { 
  DEFAULT_PEOPLE, 
  DEFAULT_TOPS, 
  DEFAULT_BOTTOMS, 
  DEFAULT_ACCESSORIES, 
  DEFAULT_COMPUTERS,
  DEFAULT_CABLES,
  DEFAULT_PHONES,
  COLORS, 
  MATERIALS 
} from './constants';
import { generateCompositeImage } from './services/geminiService';
import { GenerationState, GarmentCategory, AppMode } from './types';

const App: React.FC = () => {
  // App Mode
  const [appMode, setAppMode] = useState<AppMode>('fashion');

  // --- Fashion State ---
  const [personImage, setPersonImage] = useState<string | null>(DEFAULT_PEOPLE[0].url);
  const [selectedTop, setSelectedTop] = useState<string | null>(DEFAULT_TOPS[0].url);
  const [selectedBottom, setSelectedBottom] = useState<string | null>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null);
  const [activeFashionTab, setActiveFashionTab] = useState<GarmentCategory>('top');

  // --- Product State ---
  const [selectedComputer, setSelectedComputer] = useState<string | null>(DEFAULT_COMPUTERS[0].url);
  const [selectedCable, setSelectedCable] = useState<string | null>(DEFAULT_CABLES[0].url);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(DEFAULT_PHONES[0].url);

  // --- Shared State ---
  const [selectedColor, setSelectedColor] = useState<string>('original');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('original');

  const [genState, setGenState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    resultUrl: null
  });

  const handleGenerate = async () => {
    setGenState({ isLoading: true, error: null, resultUrl: null });

    const colorPrompt = COLORS.find(c => c.id === selectedColor)?.value;
    const materialPrompt = MATERIALS.find(m => m.id === selectedMaterial)?.value;

    try {
      let resultBase64 = '';

      if (appMode === 'fashion') {
        if (!personImage) throw new Error("请先选择一张人物图片");
        if (!selectedTop && !selectedBottom && !selectedAccessory) throw new Error("请至少选择一件服饰");
        
        resultBase64 = await generateCompositeImage(
          'fashion',
          { top: selectedTop, bottom: selectedBottom, accessory: selectedAccessory },
          personImage,
          { color: colorPrompt, material: materialPrompt }
        );
      } else {
        // Product Mode
        if (!selectedComputer && !selectedCable && !selectedPhone) throw new Error("请至少选择一个电子产品");
        
        resultBase64 = await generateCompositeImage(
          'product',
          { computer: selectedComputer, cable: selectedCable, phone: selectedPhone },
          null, // No person needed
          { color: colorPrompt, material: materialPrompt }
        );
      }

      setGenState({
        isLoading: false,
        error: null,
        resultUrl: resultBase64
      });
    } catch (error: any) {
      setGenState({
        isLoading: false,
        error: error.message || "生成失败，请稍后重试",
        resultUrl: null
      });
    }
  };

  const renderTabButton = (id: GarmentCategory, label: string, icon: React.ReactNode, hasSelection: boolean) => (
    <button
      onClick={() => setActiveFashionTab(id)}
      className={`
        flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all
        ${activeFashionTab === id 
          ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
        }
      `}
    >
      {icon}
      {label}
      {hasSelection && (
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6">
        
        <div className="grid lg:grid-cols-12 gap-6 h-full items-start">
          
          {/* LEFT SIDEBAR: Controls (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-5 overflow-y-auto lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] custom-scrollbar">
            
            {/* 1. Mode Switcher */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex">
               <button
                 onClick={() => setAppMode('fashion')}
                 className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                   appMode === 'fashion' 
                     ? 'bg-indigo-600 text-white shadow-md' 
                     : 'text-gray-500 hover:bg-gray-50'
                 }`}
               >
                 <Shirt size={16} /> 虚拟试衣
               </button>
               <button
                 onClick={() => setAppMode('product')}
                 className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                   appMode === 'product' 
                     ? 'bg-indigo-600 text-white shadow-md' 
                     : 'text-gray-500 hover:bg-gray-50'
                 }`}
               >
                 <Monitor size={16} /> 数码组合
               </button>
            </div>

            {/* FASHION MODE CONTROLS */}
            {appMode === 'fashion' && (
              <div className="grid grid-cols-2 gap-3 items-start animate-in fade-in slide-in-from-left-4 duration-300">
                <ImageSelector 
                  title="人物"
                  type="person"
                  selectedImage={personImage}
                  defaultOptions={DEFAULT_PEOPLE}
                  onSelect={(url) => {
                    if (url) setPersonImage(url);
                    setGenState(prev => ({ ...prev, error: null }));
                  }}
                />

                <div className="flex flex-col gap-3 h-full">
                  <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                     {renderTabButton('top', '上装', <Shirt size={14}/>, !!selectedTop)}
                     {renderTabButton('bottom', '下装', <Scissors size={14}/>, !!selectedBottom)}
                     {renderTabButton('accessory', '配饰', <Glasses size={14}/>, !!selectedAccessory)}
                  </div>
                  <div className="flex-grow">
                    {activeFashionTab === 'top' && (
                      <ImageSelector 
                        title="上装"
                        type="top"
                        selectedImage={selectedTop}
                        defaultOptions={DEFAULT_TOPS}
                        allowClear={true}
                        onSelect={(url) => setSelectedTop(url)}
                      />
                    )}
                    {activeFashionTab === 'bottom' && (
                      <ImageSelector 
                        title="下装"
                        type="bottom"
                        selectedImage={selectedBottom}
                        defaultOptions={DEFAULT_BOTTOMS}
                        allowClear={true}
                        onSelect={(url) => setSelectedBottom(url)}
                      />
                    )}
                    {activeFashionTab === 'accessory' && (
                      <ImageSelector 
                        title="配饰"
                        type="accessory"
                        selectedImage={selectedAccessory}
                        defaultOptions={DEFAULT_ACCESSORIES}
                        allowClear={true}
                        onSelect={(url) => setSelectedAccessory(url)}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCT MODE CONTROLS */}
            {appMode === 'product' && (
               <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                 {/* Row 1 */}
                 <ImageSelector 
                    title="电脑/主机"
                    type="computer"
                    selectedImage={selectedComputer}
                    defaultOptions={DEFAULT_COMPUTERS}
                    allowClear={true}
                    onSelect={setSelectedComputer}
                  />
                  <ImageSelector 
                    title="线材/连接"
                    type="cable"
                    selectedImage={selectedCable}
                    defaultOptions={DEFAULT_CABLES}
                    allowClear={true}
                    onSelect={setSelectedCable}
                  />
                  {/* Row 2 */}
                   <ImageSelector 
                    title="手机/终端"
                    type="phone"
                    selectedImage={selectedPhone}
                    defaultOptions={DEFAULT_PHONES}
                    allowClear={true}
                    onSelect={setSelectedPhone}
                  />
                  {/* Info Card */}
                  <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 flex flex-col justify-center text-indigo-800">
                    <h4 className="font-bold text-sm mb-1 flex items-center gap-1"><Layers size={14}/> 组合模式</h4>
                    <p className="text-xs opacity-80 leading-relaxed">
                      AI 将自动尝试将所选电子产品进行连接或组合摆放，生成专业的产品摄影图。
                    </p>
                  </div>
               </div>
            )}
            
            {/* Attributes (Common) */}
            <div className="flex-shrink-0">
              <AttributeSelector 
                colors={COLORS}
                materials={MATERIALS}
                selectedColor={selectedColor}
                selectedMaterial={selectedMaterial}
                onColorChange={setSelectedColor}
                onMaterialChange={setSelectedMaterial}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={genState.isLoading}
              className={`
                w-full relative overflow-hidden rounded-xl py-4 
                bg-gradient-to-r from-indigo-600 to-purple-600 
                text-white font-bold text-lg shadow-lg shadow-indigo-200/50
                transition-all duration-300 hover:shadow-indigo-300/50 transform active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              `}
            >
              {genState.isLoading ? (
                <Wand2 className="animate-spin" />
              ) : (
                <Wand2 />
              )}
              <span>
                {genState.isLoading ? 'AI 生成中...' : (appMode === 'fashion' ? '开始换装' : '生成组合')}
              </span>
            </button>
          </div>

          {/* RIGHT MAIN AREA: Result Canvas (Col Span 8) */}
          <div className="lg:col-span-8 lg:h-[calc(100vh-8rem)] min-h-[500px]">
             <ResultSection 
               isLoading={genState.isLoading} 
               resultUrl={genState.resultUrl}
               error={genState.error}
             />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;