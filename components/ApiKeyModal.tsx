import React, { useState, useEffect } from 'react';
import { KeyIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onClose: () => void;
  initialKey: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose, initialKey }) => {
  const [key, setKey] = useState(initialKey);

  useEffect(() => {
    setKey(initialKey);
  }, [initialKey, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-cyber-panel border border-cyber-primary/30 relative clip-corner shadow-[0_0_50px_rgba(255,0,128,0.2)]">
        {/* 顶部装饰条 */}
        <div className="h-1 w-full bg-gradient-to-r from-cyber-primary to-cyber-secondary"></div>
        
        <div className="p-8 relative overflow-hidden">
          {/* 背景装饰字 */}
          <span className="absolute -right-4 -top-4 text-8xl font-display font-bold text-white/5 select-none">AUTH</span>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-cyber-primary/10 border border-cyber-primary/50">
              <LockClosedIcon className="w-6 h-6 text-cyber-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wider">身份认证</h2>
              <p className="text-xs text-cyber-secondary font-mono">SYSTEM ACCESS REQUIRED</p>
            </div>
          </div>

          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            请输入您的 <span className="text-cyber-primary font-bold">Z-Image-Turbo API Key</span> 以连接至神经生成网络。
            <br />
            <span className="text-xs text-gray-600 mt-1 block">* 密钥仅存储在本地浏览器缓存中</span>
          </p>

          <div className="relative mb-8 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyIcon className="h-4 w-4 text-gray-500 group-focus-within:text-cyber-secondary transition-colors" />
            </div>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-black/40 border border-gray-700 text-white text-sm rounded-none focus:ring-0 focus:border-cyber-secondary block w-full pl-10 p-3 font-mono transition-all placeholder-gray-600"
            />
            {/* 角标装饰 */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-secondary opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-secondary opacity-50"></div>
          </div>

          <div className="flex justify-end gap-4">
            {initialKey && (
               <button
               onClick={onClose}
               className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest hover:bg-white/5"
             >
               取消
             </button>
            )}
           
            <button
              onClick={() => onSave(key)}
              className="relative px-8 py-2 bg-cyber-primary hover:bg-pink-600 text-white font-bold text-sm tracking-widest transition-all clip-corner shadow-[0_0_20px_rgba(255,0,128,0.4)] hover:shadow-[0_0_30px_rgba(255,0,128,0.6)] active:scale-95"
            >
              连接系统
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;