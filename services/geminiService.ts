import { GoogleGenAI } from "@google/genai";
import { AppMode, FashionItems, ProductItems } from "../types";

interface ImageInfo {
  data: string;
  mimeType: string;
  width: number;
  height: number;
}

// Resize image to max dimension (e.g. 1024px) to prevent API 500 errors
// and convert to standard JPEG format
const processImage = (img: HTMLImageElement, maxDim: number = 1024): string => {
  let width = img.width;
  let height = img.height;

  // Calculate new dimensions
  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Could not get canvas context");
  
  // Fill white background to avoid transparent artifacts
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Draw and resize
  ctx.drawImage(img, 0, 0, width, height);
  
  // Return as standard JPEG base64
  return canvas.toDataURL('image/jpeg', 0.85);
};

// Helper to load image from URL, resize it, and get info
// UPDATED: Uses Image object instead of fetch() to better handle CORS and blob URLs
const getImageInfoFromUrl = async (url: string): Promise<ImageInfo> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Important: Set crossOrigin for external URLs (like Unsplash) to allow canvas export.
    // Blob URLs are local and don't strictly need it, but 'anonymous' usually works fine.
    // However, for local blobs, sometimes it's safer to omit if not needed, 
    // but Unsplash images definitely need it.
    if (url.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        // 2. Resize and standardize to JPEG
        // Max 1024px is usually safe for GenAI models to avoid 500/Timeouts
        const resizedBase64 = processImage(img, 1024);
        
        // 3. Extract raw base64 data
        const data = resizedBase64.split(',')[1];
        
        resolve({
          mimeType: 'image/jpeg', // We always convert to jpeg in processImage
          data: data,
          width: img.width, 
          height: img.height
        });
      } catch (e) {
        console.error("Canvas processing error:", e);
        reject(new Error("Failed to process image. It might be a CORS issue with the image source."));
      }
    };
    
    img.onerror = (e) => {
       console.error("Image load error:", e);
       reject(new Error("Failed to load image. Please check your internet connection or try a different image."));
    };

    img.src = url;
  });
};

// Helper to find closest supported aspect ratio
const getSupportedAspectRatio = (width: number, height: number): string => {
  const ratio = width / height;
  const targets = [
    { str: '1:1', val: 1 },
    { str: '3:4', val: 3/4 },
    { str: '4:3', val: 4/3 },
    { str: '9:16', val: 9/16 },
    { str: '16:9', val: 16/9 },
  ];

  // Find the target with minimum difference
  const closest = targets.reduce((prev, curr) => 
    Math.abs(curr.val - ratio) < Math.abs(prev.val - ratio) ? curr : prev
  );
  
  return closest.str;
};

interface GenerateOptions {
  color?: string;
  material?: string;
}

export const generateCompositeImage = async (
  mode: AppMode,
  items: FashionItems | ProductItems,
  personImageUrl: string | null, // Only used in fashion mode
  options: GenerateOptions = {}
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contentParts: any[] = [];
  let targetAspectRatio = '1:1';
  
  // --- FASHION MODE LOGIC ---
  if (mode === 'fashion') {
    if (!personImageUrl) throw new Error("Person image is required for Fashion mode.");
    
    const fItems = items as FashionItems;
    const hasTop = !!fItems.top;
    const hasBottom = !!fItems.bottom;
    const hasAccessory = !!fItems.accessory;

    if (!hasTop && !hasBottom && !hasAccessory) {
      throw new Error("At least one item (Top, Bottom, or Accessory) must be selected.");
    }

    console.log("Preparing Fashion Generation...");
    
    // 1. Person (Anchor)
    const personImage = await getImageInfoFromUrl(personImageUrl);
    targetAspectRatio = getSupportedAspectRatio(personImage.width, personImage.height);
    
    contentParts.push({ text: "TEMP_PROMPT" }); // Placeholder [0]
    contentParts.push({ inlineData: { mimeType: personImage.mimeType, data: personImage.data } }); // [1]

    let inputDesc = "Input 1: Person (Model).\n";
    let index = 2;

    if (hasTop && fItems.top) {
      const img = await getImageInfoFromUrl(fItems.top);
      contentParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
      inputDesc += `Input ${index}: Top Garment.\n`;
      index++;
    }
    if (hasBottom && fItems.bottom) {
      const img = await getImageInfoFromUrl(fItems.bottom);
      contentParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
      inputDesc += `Input ${index}: Bottom Garment.\n`;
      index++;
    }
    if (hasAccessory && fItems.accessory) {
      const img = await getImageInfoFromUrl(fItems.accessory);
      contentParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
      inputDesc += `Input ${index}: Accessory.\n`;
      index++;
    }

    // Customization
    const { color, material } = options;
    let customPrompt = "";
    if (color && color !== 'original') customPrompt += `\n- Change garment color to: ${color}.`;
    if (material && material !== 'original') customPrompt += `\n- Change garment material to: ${material}.`;

    const prompt = `
      Virtual Try-On Task.
      ${inputDesc}
      Goal: Photorealistic image of Person (Input 1) wearing the provided items.
      Rules:
      1. Keep Person's face, hair, and pose identical to Input 1.
      2. Replace original clothes with provided Inputs.
      ${hasTop ? '- Put Input Top on upper body.' : ''}
      ${hasBottom ? '- Put Input Bottom on lower body.' : ''}
      ${hasAccessory ? '- Wear Input Accessory naturally.' : ''}
      3. Blend lighting and shadows perfectly.
      ${customPrompt}
      Output: High Quality Image.
    `;
    contentParts[0] = { text: prompt };
  } 
  
  // --- PRODUCT MODE LOGIC ---
  else if (mode === 'product') {
    const pItems = items as ProductItems;
    const hasComp = !!pItems.computer;
    const hasCable = !!pItems.cable;
    const hasPhone = !!pItems.phone;

    if (!hasComp && !hasCable && !hasPhone) {
      throw new Error("Select at least one electronic item.");
    }

    console.log("Preparing Product Composition...");
    contentParts.push({ text: "TEMP_PROMPT" }); // Placeholder [0]

    let inputDesc = "";
    let index = 1; // GenAI parts index for prompt text reference (actual array index starts at 1)

    // Helper to add part
    const addPart = async (url: string, name: string) => {
      const img = await getImageInfoFromUrl(url);
      contentParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
      inputDesc += `Input ${index}: ${name}.\n`;
      index++;
      // Set aspect ratio based on first item
      if (index === 2) {
        targetAspectRatio = getSupportedAspectRatio(img.width, img.height); 
      }
    };

    if (hasComp && pItems.computer) await addPart(pItems.computer, "Laptop/Computer");
    if (hasCable && pItems.cable) await addPart(pItems.cable, "Data Cable");
    if (hasPhone && pItems.phone) await addPart(pItems.phone, "Smartphone");

    const prompt = `
      Product Photography Composition Task.
      ${inputDesc}
      Goal: Create a professional, clean product photo showcasing these items connected or arranged together.
      
      Scenario:
      - If multiple items are provided (e.g. Computer + Cable + Phone), show them PHYSICALLY CONNECTED.
      - Example: The Cable should be plugged into the Computer on one end and the Phone on the other.
      - Layout: Clean desk or studio background. Minimalist aesthetic.
      - Lighting: Soft, professional studio lighting.
      
      Requirements:
      - High resolution, photorealistic.
      - Items should look consistent in scale.
      - Do not distort text or logos if possible.
    `;
    contentParts[0] = { text: prompt };
  }

  // --- API CALL ---
  try {
    console.log("Sending to Gemini...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: contentParts
      },
      config: {
        imageConfig: {
          aspectRatio: targetAspectRatio as any
        }
      }
    });

    const candidate = response.candidates?.[0];
    // Safety check
    if (candidate?.finishReason === 'SAFETY') {
      throw new Error("The request was blocked by safety filters. Please try different images.");
    }

    let outputImageBase64 = '';
    const parts = candidate?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          outputImageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!outputImageBase64) {
      console.warn("Full Response:", JSON.stringify(response, null, 2));
      throw new Error("AI successfully processed but returned no image data. Try simplifying inputs.");
    }

    return `data:image/png;base64,${outputImageBase64}`;

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    if (error.message?.includes('500') || error.status === 500) {
      throw new Error("Server Error (500). Image might be too large or complex. Try fewer items.");
    }
    throw error;
  }
};
