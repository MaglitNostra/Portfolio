import { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { NeuralBackground } from './components/Background/NeuralBackground';
import projectsData from './data/projects.json';

function App() {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const [bgEnabled, setBgEnabled] = useState(() => {
        const saved = localStorage.getItem('app-fx-enabled');
        return saved !== 'false';
    });

    const [quality, setQuality] = useState(() => {
        const saved = localStorage.getItem('app-quality-scale');
        if (saved) {
            return parseFloat(saved);
        }
        return window.innerWidth < 768 ? 0.2 : 0.35;
    });

    useEffect(() => {
        localStorage.setItem('app-fx-enabled', bgEnabled.toString());
    }, [bgEnabled]);

    useEffect(() => {
        localStorage.setItem('app-quality-scale', quality.toString());
    }, [quality]);


    const firstProject = projectsData[0];
    const projectDesc = (firstProject.shortDesc as any)[language];

    const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuality(parseFloat(e.target.value));
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-gray-900
        dark:text-gray-100 p-5 transition-colors duration-300 relative overflow-hidden">

            {bgEnabled && <NeuralBackground quality={quality} />}

            {!bgEnabled && (
                <div className="fixed inset-0 -z-20 bg-gray-100 dark:bg-[#0f172a] transition-colors duration-300" />
            )}

            <div className="relative z-10 max-w-2xl w-full space-y-8 backdrop-blur-md bg-white/40
                dark:bg-black/40 p-8 rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl">

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-4xl font-bold text-center sm:text-left">Portfolio</h1>

                    <div className="flex gap-4 items-center">
                        {bgEnabled && (
                            <div className="flex flex-col items-end gap-1 bg-white/20 dark:bg-black/20
                                px-3 py-2 rounded-lg border border-white/10">
                                <div className="flex justify-between w-full text-[10px] font-bold 
                                    uppercase tracking-wider opacity-70">
                                    <span>Quality</span>
                                    <span>{quality.toFixed(2)}x</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1.0"
                                    step="0.05"
                                    value={quality}
                                    onChange={handleQualityChange}
                                    className="w-24 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer
                                    dark:bg-gray-700 accent-indigo-500"
                                />
                            </div>
                        )}

                        <div className="flex flex-col items-center justify-center gap-1 bg-white/20 
                            dark:bg-black/20 px-3 py-2 
                            rounded-lg border border-white/10 h-full">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 leading-none">FX</span>
                            <button
                                onClick={() => setBgEnabled(!bgEnabled)}
                                className={`relative w-8 h-4 rounded-full transition-colors duration-300 
                                    ${bgEnabled ? 'bg-green-500' : 'bg-gray-400'}`}
                                title="Włącz/Wyłącz FX"
                            >
                                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full 
                                    shadow-sm transform transition-transform duration-300 
                                    ${bgEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-400/30 my-4"></div>

                <div>
                    <h2 className="text-2xl font-bold mb-2">1. Język / Language</h2>
                    <p className="italic mb-4 opacity-80">"{t.hero.role}"</p>
                    <div className="flex gap-4">
                        <button onClick={() => setLanguage('pl')}
                            className={`px-4 py-2 rounded font-medium transition ${language === 'pl'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>Polski</button>
                        <button onClick={() => setLanguage('en')}
                            className={`px-4 py-2 rounded font-medium transition ${language === 'en'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>English</button>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-2">2. Motyw / Theme</h2>
                    <p className="mb-2 opacity-80">Change Theme</p>
                    <button onClick={toggleTheme} className="px-5 py-2.5 bg-indigo-600 
                        text-white rounded font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30">
                        {theme === 'light' ? '🌙 Przełącz na Ciemny' : '☀️ Przełącz na Jasny'}
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-2">3. Dane / Data</h2>
                    <p>Last project: <b className="text-indigo-600 dark:text-indigo-400">{firstProject.name}</b></p>
                    <p className="text-sm opacity-80 mt-1 leading-relaxed">{projectDesc}</p>
                </div>

                <p className="text-center text-sm opacity-50 mt-8 font-mono">
                    {bgEnabled ? `Resolution Scale: ${(quality * 100).toFixed(0)}%` : "GPU Offline."}
                </p>
            </div>

        </div>
    );
}

export default App;