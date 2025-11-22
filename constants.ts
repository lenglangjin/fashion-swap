import { ImageAsset, AttributeOption } from './types';

// Real Unsplash images - Updated to Full Body shots
export const DEFAULT_PEOPLE: ImageAsset[] = [
  {
    id: 'p1_full',
    url: 'https://images.unsplash.com/photo-1595956553066-fe24a8c33395?q=80&w=800&auto=format&fit=crop',
    label: '全身模特(女)',
    type: 'person'
  },
  {
    id: 'p2_full',
    url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
    label: '全身模特(男)',
    type: 'person'
  },
  {
    id: 'p3_full',
    url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop',
    label: '时尚站姿',
    type: 'person'
  },
  {
    id: 'p4_casual',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    label: '连衣裙展示',
    type: 'person'
  }
];

export const DEFAULT_TOPS: ImageAsset[] = [
  {
    id: 't1',
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    label: '商务衬衫',
    type: 'top'
  },
  {
    id: 't2',
    url: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?q=80&w=800&auto=format&fit=crop',
    label: '连帽卫衣',
    type: 'top'
  },
  {
    id: 't3',
    url: 'https://images.unsplash.com/photo-1550614000-4b9519e022ce?q=80&w=800&auto=format&fit=crop',
    label: '碎花上衣',
    type: 'top'
  },
  {
    id: 't4',
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    label: '牛仔夹克',
    type: 'top'
  }
];

export const DEFAULT_BOTTOMS: ImageAsset[] = [
  {
    id: 'b1',
    url: 'https://images.unsplash.com/photo-1542272617-08f086303293?q=80&w=800&auto=format&fit=crop',
    label: '经典牛仔裤',
    type: 'bottom'
  },
  {
    id: 'b2',
    url: 'https://images.unsplash.com/photo-1584865288642-42040af89b21?q=80&w=800&auto=format&fit=crop',
    label: '运动长裤',
    type: 'bottom'
  },
  {
    id: 'b3',
    url: 'https://images.unsplash.com/photo-1582142893718-99d5d5874c3a?q=80&w=800&auto=format&fit=crop',
    label: '百褶裙',
    type: 'bottom'
  },
  {
    id: 'b4',
    url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop',
    label: '卡其短裤',
    type: 'bottom'
  }
];

export const DEFAULT_ACCESSORIES: ImageAsset[] = [
  {
    id: 'a1',
    url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
    label: '时尚墨镜',
    type: 'accessory'
  },
  {
    id: 'a2',
    url: 'https://images.unsplash.com/photo-1529958030586-3a1138cbb422?q=80&w=800&auto=format&fit=crop',
    label: '草编礼帽',
    type: 'accessory'
  },
  {
    id: 'a3',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    label: '手提包',
    type: 'accessory'
  }
];

// --- Product Mode Defaults ---

export const DEFAULT_COMPUTERS: ImageAsset[] = [
  {
    id: 'c1',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=800&auto=format&fit=crop',
    label: 'MacBook Pro',
    type: 'computer'
  },
  {
    id: 'c2',
    url: 'https://images.unsplash.com/photo-1531297425937-2536720f226d?q=80&w=800&auto=format&fit=crop',
    label: 'Surface Laptop',
    type: 'computer'
  },
];

export const DEFAULT_CABLES: ImageAsset[] = [
  {
    id: 'cb1',
    url: 'https://images.unsplash.com/photo-1616440347437-b1c73416ef12?q=80&w=800&auto=format&fit=crop',
    label: 'USB-C 编织线',
    type: 'cable'
  },
  {
    id: 'cb2',
    url: 'https://images.unsplash.com/photo-1555543451-ee5a4f71d728?q=80&w=800&auto=format&fit=crop',
    label: '白色数据线',
    type: 'cable'
  },
];

export const DEFAULT_PHONES: ImageAsset[] = [
  {
    id: 'ph1',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    label: 'iPhone',
    type: 'phone'
  },
  {
    id: 'ph2',
    url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?q=80&w=800&auto=format&fit=crop',
    label: 'Android',
    type: 'phone'
  },
];

export const LOADING_MESSAGES = [
  "正在分析图像内容...",
  "AI 正在构思画面布局...",
  "正在融合光影效果...",
  "即将完成生成...",
  "最后优化中..."
];

export const COLORS: AttributeOption[] = [
  { id: 'original', label: '原色', value: 'original', preview: 'transparent' },
  { id: 'black', label: '黑色', value: 'Black', preview: '#000000' },
  { id: 'white', label: '白色', value: 'White', preview: '#FFFFFF' },
  { id: 'red', label: '红色', value: 'Bright Red', preview: '#EF4444' },
  { id: 'blue', label: '蓝色', value: 'Royal Blue', preview: '#3B82F6' },
  { id: 'green', label: '绿色', value: 'Emerald Green', preview: '#10B981' },
  { id: 'yellow', label: '黄色', value: 'Sunny Yellow', preview: '#F59E0B' },
  { id: 'pink', label: '粉色', value: 'Pastel Pink', preview: '#EC4899' },
  { id: 'purple', label: '紫色', value: 'Deep Purple', preview: '#8B5CF6' },
];

export const MATERIALS: AttributeOption[] = [
  { id: 'original', label: '原材质', value: 'original' },
  { id: 'cotton', label: '纯棉', value: 'Cotton fabric' },
  { id: 'denim', label: '牛仔', value: 'Denim fabric' },
  { id: 'silk', label: '丝绸', value: 'Silk satin' },
  { id: 'leather', label: '皮革', value: 'Leather' },
  { id: 'wool', label: '羊毛', value: 'Knitted Wool' },
  { id: 'linen', label: '亚麻', value: 'Linen fabric' },
  { id: 'nylon', label: '尼龙', value: 'Nylon fabric' },
];