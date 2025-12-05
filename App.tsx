import React, { useState, useEffect } from 'react';
import { SparklesIcon, Cog6ToothIcon, ClockIcon, PhotoIcon, CpuChipIcon, BoltIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import AnimatedBackground from './components/AnimatedBackground';
import ApiKeyModal from './components/ApiKeyModal';
import ResultCard from './components/ResultCard';
import { generateImage } from './services/zImageService';
import { HistoryItem } from './types';

// Load initial history
const loadHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem('z_image_history');
    if (!stored) return [];

    const history = JSON.parse(stored) as HistoryItem[];

    // Clean up malformed base64 strings from previous versions
    const cleanedHistory = history.map(item => {
      if (item.base64 && typeof item.base64 === 'string' && item.base64.startsWith('data:image/png;base64,data:image/png;base64,')) {
        return {
          ...item,
          base64: item.base64.replace('data:image/png;base64,data:image/png;base64,', 'data:image/png;base64,')
        };
      }
      // Also fix cases where the prefix was missing entirely and added twice in the view
      if (item.base64 && typeof item.base64 === 'string' && !item.base64.startsWith('data:image/png;base64,')) {
        return {
          ...item,
          base64: `data:image/png;base64,${item.base64}`
        }
      }
      return item;
    });

    return cleanedHistory;
  } catch {
    // If parsing fails, clear the corrupted history
    localStorage.removeItem('z_image_history');
    return [];
  }
};

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('z_image_api_key') || '');
  const [isKeyModalOpen, setKeyModalOpen] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [seed, setSeed] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);
  const [activeImage, setActiveImage] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setKeyModalOpen(true);
    }
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('z_image_history', JSON.stringify(history.slice(0, 20))); // Keep last 20
  }, [history]);

  const handleSaveKey = (key: string) => {
    if (key.trim()) {
      localStorage.setItem('z_image_api_key', key.trim());
      setApiKey(key.trim());
      setKeyModalOpen(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!apiKey) {
      setKeyModalOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    setActiveImage(null); // Clear active image to show loading state

    try {
      const requestSeed = seed !== '' ? Number(seed) : null;
      const response = await generateImage(apiKey, {
        prompt: prompt.trim(),
        seed: requestSeed
      });

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        prompt: response.prompt,
        base64: response.base64,
        timestamp: Date.now(),
        seed: requestSeed
      };

      setHistory(prev => [newItem, ...prev]);
      setActiveImage(newItem);
    } catch (err: any) {
      setError(err.message || "生成失败，请检查网络或 Key。");
    } finally {
      setLoading(false);
    }
  };

  const handleRandomSeed = () => {
    // Generate a random integer between 1 and 9999999999
    const randomSeed = Math.floor(Math.random() * 1000000000) + 1;
    setSeed(randomSeed);
  };

  const handleDelete = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (activeImage?.id === id) {
      setActiveImage(null);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-cyber-primary selection:text-white flex flex-col text-gray-100">
      <AnimatedBackground />

      {/* 顶部 HUD 导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-cyber-dark/80 backdrop-blur-md border-b border-white/5 h-16">
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 bg-cyber-primary/20 border border-cyber-primary flex items-center justify-center clip-corner">
                <BoltIcon className="w-6 h-6 text-cyber-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyber-secondary"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-wider text-white leading-none">
                Z-TURBO <span className="text-cyber-primary text-sm">V.1</span>
              </span>
              <span className="text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase">Neural Graphics Terminal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-sm">
              <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500 shadow-[0_0_5px_lime]' : 'bg-red-500'}`}></div>
              <span className="text-xs font-mono text-gray-400">{apiKey ? 'SYSTEM LINKED' : 'OFFLINE'}</span>
            </div>
            <button
              onClick={() => setKeyModalOpen(true)}
              className="p-2 text-cyber-secondary border border-cyber-secondary/30 hover:bg-cyber-secondary/10 hover:border-cyber-secondary transition-all clip-corner group"
              title="设置 / API Key"
            >
              <Cog6ToothIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </header>

      {/* 主界面 */}
      <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full flex-grow flex flex-col lg:flex-row gap-6">

        {/* 左侧：控制台 */}
        <div className="lg:w-[400px] flex-shrink-0 flex flex-col gap-6">

          {/* 输入面板 */}
          <div className="bg-cyber-panel border border-white/10 p-1 relative shadow-2xl">
            {/* 装饰边框 */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-secondary to-transparent opacity-50"></div>

            <div className="p-5 bg-stripes relative">
              <div className="flex items-center gap-2 mb-4">
                <CpuChipIcon className="w-5 h-5 text-cyber-secondary" />
                <h2 className="text-lg font-bold text-white tracking-widest font-display">指令输入</h2>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-xs font-mono text-cyber-primary mb-2 uppercase tracking-wider flex justify-between">
                    <span>Prompt (咒语)</span>
                    <span className="text-gray-600">INPUT_STREAM_01</span>
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="在此输入画面描述... 例如：赛博朋克风格的少女，银色长发，霓虹背景"
                    className="w-full h-40 bg-black/40 border border-gray-700 focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary/50 text-white placeholder-gray-500 p-3 font-sans text-sm resize-none transition-all rounded-sm"
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs font-mono text-cyber-secondary mb-2 uppercase tracking-wider flex justify-between">
                    <span>Seed (种子)</span>
                    <span className="text-gray-600">OPTIONAL</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="留空为随机"
                      className="flex-1 bg-black/40 border border-gray-700 focus:border-cyber-secondary focus:ring-1 focus:ring-cyber-secondary/50 text-white placeholder-gray-600 p-2 font-mono text-sm transition-all rounded-sm appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={handleRandomSeed}
                      className="px-3 py-2 bg-white/5 border border-gray-700 hover:bg-cyber-secondary/20 hover:border-cyber-secondary/50 text-gray-300 hover:text-cyber-secondary transition-all rounded-sm"
                      title="随机生成种子"
                    >
                      <ArrowPathIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className={`w-full py-3 font-display font-bold tracking-widest uppercase transition-all clip-corner relative overflow-hidden group ${loading || !prompt.trim()
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      : 'bg-cyber-primary hover:bg-pink-600 text-white shadow-[0_0_20px_rgba(255,0,128,0.4)]'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-pulse">执行中...</span>
                    </span>
                  ) : (
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <SparklesIcon className="w-5 h-5" />
                      <span>启动生成</span>
                    </div>
                  )}
                  {/* 按钮Hover时的扫光特效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0"></div>
                </button>

                {error && (
                  <div className="p-3 bg-red-900/20 border-l-2 border-red-500 text-red-400 text-xs font-mono">
                    ERROR: {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 历史记录列表 (桌面端垂直) */}
          <div className="flex-grow bg-cyber-panel border border-white/5 p-4 hidden lg:flex flex-col overflow-hidden relative min-h-[200px]">
            <div className="absolute top-0 right-0 p-1">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-600"></div>
                <div className="w-1 h-1 bg-gray-600"></div>
                <div className="w-1 h-1 bg-gray-600"></div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
              <ClockIcon className="w-4 h-4 text-cyber-secondary" />
              <h3 className="font-display text-sm font-bold text-gray-300 uppercase tracking-wider">历史档案</h3>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !loading && setActiveImage(item)}
                  className={`group flex items-center gap-3 p-2 border border-transparent hover:bg-white/5 cursor-pointer transition-all ${activeImage?.id === item.id ? 'bg-white/5 border-l-cyber-primary border-l-2' : ''}`}
                >
                  <div className="w-12 h-12 flex-shrink-0 bg-black border border-gray-700 overflow-hidden">
                    <img src={item.base64} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-300 truncate font-sans">{item.prompt}</p>
                    <p className="text-[10px] text-gray-600 font-mono mt-0.5">{new Date(item.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-center py-10 text-gray-600 text-xs font-mono">
                  NO DATA FOUND
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：预览视窗 */}
        <div className="flex-grow flex flex-col min-h-[500px] relative">
          {/* 视窗边框装饰 */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-secondary pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-secondary pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-secondary pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-secondary pointer-events-none"></div>

          <div className="flex-grow bg-black/20 backdrop-blur-sm border border-white/5 p-1 h-full flex items-center justify-center relative overflow-hidden">
            {/* 视窗背景网格 */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            {/* 状态渲染逻辑：Loading > Image > Empty */}
            {loading ? (
              <div className="flex flex-col items-center justify-center z-10 w-full h-full animate-slide-up">
                <div className="relative w-32 h-32 mb-8">
                  {/* 旋转的科技环 */}
                  <div className="absolute inset-0 border-2 border-cyber-secondary/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
                  <div className="absolute inset-4 border-2 border-t-cyber-secondary border-r-cyber-secondary/50 border-b-transparent border-l-transparent rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                  <div className="absolute inset-8 border-4 border-cyber-primary/20 rounded-full animate-pulse"></div>

                  {/* 中心闪烁点 */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyber-primary shadow-[0_0_10px_#ff0080] rounded-full animate-ping"></div>
                </div>

                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-display font-bold text-white tracking-widest animate-pulse">NEURAL LINKING</h3>
                  <p className="text-xs font-mono text-cyber-secondary">PROCESSING REQUEST DATA...</p>
                </div>

                {/* 进度条装饰 */}
                <div className="mt-6 w-64 h-1 bg-gray-800 overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full w-1/2 bg-cyber-primary blur-[2px] animate-[slideUp_1s_ease-in-out_infinite] translate-x-[-100%]"></div>
                  <style>{`
                        @keyframes progress {
                          0% { transform: translateX(-100%); }
                          100% { transform: translateX(200%); }
                        }
                      `}</style>
                  <div className="h-full bg-cyber-primary animate-[progress_1.5s_infinite_linear]"></div>
                </div>
              </div>
            ) : activeImage ? (
              <div className="w-full h-full p-4 lg:p-8 animate-slide-up z-10">
                <ResultCard
                  base64={activeImage.base64}
                  prompt={activeImage.prompt}
                  isNew={!loading && history[0]?.id === activeImage.id}
                  onDelete={() => handleDelete(activeImage.id!)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-600 opacity-50 z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyber-secondary blur-xl opacity-20 animate-pulse"></div>
                  <PhotoIcon className="w-24 h-24 mb-4 relative z-10" />
                </div>
                <p className="font-display tracking-widest text-sm">WAITING FOR INPUT...</p>
              </div>
            )}
          </div>

          {/* 移动端历史记录 */}
          <div className="mt-4 lg:hidden">
            <h3 className="text-xs font-mono text-gray-500 mb-2 uppercase">Recent Cache</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !loading && setActiveImage(item)}
                  className={`flex-shrink-0 w-16 h-16 border ${activeImage?.id === item.id ? 'border-cyber-secondary' : 'border-gray-800'} overflow-hidden bg-black`}
                >
                  <img src={item.base64} alt="history" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onSave={handleSaveKey}
        onClose={() => setKeyModalOpen(false)}
        initialKey={apiKey}
      />
    </div>
  );
};

export default App;