import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-cyber-dark">
      {/* 动态光晕 */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyber-primary/10 rounded-full blur-[120px] animate-pulse-fast"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyber-secondary/10 rounded-full blur-[120px] animate-pulse-fast" style={{ animationDelay: '1s' }}></div>
      
      {/* 科技感网格 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,128,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* 扫描线效果 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none"></div>

      {/* 装饰性文字 */}
      <div className="absolute top-20 right-10 font-display text-cyber-secondary/10 text-6xl font-bold select-none pointer-events-none rotate-90">
        SYSTEM ONLINE
      </div>
    </div>
  );
};

export default AnimatedBackground;