//index.tsx
'use client';

import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { useRef, useState } from 'react';

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setLogoImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQRCode = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Set a fixed size for the downloaded QR code
    const downloadSize = 4000; // Smaller fixed size for download
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = document.createElement('img');
    
    img.onload = () => {
      // Set canvas to our desired download size
      canvas.width = downloadSize;
      canvas.height = downloadSize;
      
      // Use better quality settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw image at the compact size
      ctx.drawImage(img, 0, 0, downloadSize, downloadSize);
      
      // Convert to PNG with higher compression
      const pngFile = canvas.toDataURL('image/png', 0.8); // Compress with 0.8 quality
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/assets/wallpaper.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 via-blue-500/50 to-teal-500/50" />
      </div>
      
      <div className="relative z-10 bg-black/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">QR Code Generator</h1>
        
        <div className="space-y-6">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL here"
              className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"
            />
          </div>
          
          <div className="flex justify-center space-x-4">
            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-all">
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            
            <button
              onClick={downloadQRCode}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!url}
            >
              Download QR
            </button>
          </div>
          
          {url && (
            <div ref={qrRef} className="flex justify-center p-6 bg-white rounded-lg">
              <QRCodeSVG
                value={url}
                size={256}
                level="H"
                imageSettings={logoImage ? {
                  src: logoImage,
                  height: 50,
                  width: 50,
                  excavate: true,
                } : undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}