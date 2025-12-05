import React from 'react';
import { ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline';

interface ResultCardProps {
  base64: string;
  prompt: string;
  isNew: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ base64, prompt, isNew }) => {
  const imageUrl = `data:image/png;base64,${base64}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `z-turbo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`group relative w-full h-full min-h-[400px] bg-cyber-panel border border-cyber-secondary/30 p-2 shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,240,255,0.2)] ${isNew ? 'animate-slide-up' : ''}`}>
      
      {/* 装饰性角标 */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyber-secondary z-20"></div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyber-primary z-20"></div>

      {/* 图片容器 */}
      <div className="relative w-full h-full overflow-hidden bg-black/50">
        <img 
          src={imageUrl} 
          alt={prompt} 
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
        />
        
        {/* 扫描线遮罩 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[size:100%_2px,3px_100%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* 信息浮层 */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-cyber-secondary/30 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="text-xs text-cyber-secondary font-mono mb-1">PROMPT DATA</p>
              <p className="text-white text-sm line-clamp-2 font-sans font-light">
                {prompt}
              </p>
            </div>
            <button 
              onClick={handleDownload}
              className="flex items-center justify-center w-10 h-10 bg-cyber-primary/20 border border-cyber-primary text-cyber-primary hover:bg-cyber-primary hover:text-white transition-all rounded-sm"
              title="保存到本地"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;