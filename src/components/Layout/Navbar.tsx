import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { SunIcon, MoonIcon } from '../UI/Icons';
import { LogoMN } from '../UI/Logo';

export type ViewType = 'home' | 'projects';

interface NavbarProps {
    bgEnabled: boolean;
    setBgEnabled: (val: boolean) => void;
    quality: number;
    setQuality: (val: number) => void;
    currentView: ViewType;
    setView: (view: ViewType) => void;
}

export const Navbar = ({ bgEnabled, setBgEnabled, quality, setQuality, currentView, setView }: NavbarProps) => {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuality(parseFloat(e.target.value));
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-40 backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-gray-200 
            dark:border-white/10 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <div
                    className="flex items-center gap-4 group cursor-pointer"
                    onClick={() => setView('home')}
                >
                    <div className="relative w-10 h-10 flex items-center justify-center 
                        bg-zinc-900 rounded-lg border border-white/5 shadow-sm 
                        overflow-hidden transition-transform group-hover:scale-105 duration-300"
                    >
                        <LogoMN className="w-8 h-8 relative z-10" />
                    </div>
                    <div className="hidden sm:flex flex-col leading-none">
                        <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight 
                            group-hover:text-[#055df5] transition-colors duration-300">
                            Dominik Boniecki
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 
                            group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors mt-0.5">
                            <span className="text-[#055df5] font-bold">&lt;</span>
                            MaglitNostra
                            <span className="text-[#055df5] font-bold">/&gt;</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6 font-medium text-sm mx-4">
                    <button
                        onClick={() => setView('home')}
                        className={`transition-colors 
                            ${currentView === 'home'
                                ? 'text-[#055df5] font-bold'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        {t.nav.home}
                    </button>
                    <button
                        onClick={() => setView('projects')}
                        className={`transition-colors 
                            ${currentView === 'projects'
                                ? 'text-[#055df5] font-bold'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        {t.nav.projects}
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4 mr-2 border-r border-gray-300 dark:border-gray-700 pr-4">
                        {bgEnabled && (
                            <div className="flex flex-col items-end justify-center w-20">
                                <div className="flex justify-between w-full text-[8px] font-bold uppercase 
                                    tracking-wider opacity-60 mb-0.5 font-mono">
                                    <span>Qual</span>
                                    <span>{(quality * 100).toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1.0"
                                    step="0.05"
                                    value={quality}
                                    onChange={handleQualityChange}
                                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer 
                                        dark:bg-gray-700 accent-[#055df5]"
                                />
                            </div>
                        )}
                        <button
                            onClick={() => setBgEnabled(!bgEnabled)}
                            className={`flex flex-col items-center justify-center w-7 h-7 rounded transition-all 
                                ${bgEnabled
                                    ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                    : 'bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}
                        >
                            <span className="text-[8px] font-bold">FX</span>
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center text-xs font-bold gap-1 bg-gray-100 dark:bg-white/5 p-1 
                        rounded-lg border border-gray-200 dark:border-white/5">
                        <button onClick={() => setLanguage('pl')} className={`px-2 py-1 rounded transition-all 
                            ${language === 'pl'
                                ? 'bg-white dark:bg-zinc-800 text-[#055df5] shadow-xs'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>PL</button>
                        <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded transition-all 
                            ${language === 'en'
                                ? 'bg-white dark:bg-zinc-800 text-[#055df5] shadow-xs'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>EN</button>
                    </div>

                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 
                        transition-colors text-gray-700 dark:text-gray-200">
                        {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </nav>
    );
};