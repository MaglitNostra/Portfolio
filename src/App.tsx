import { useEffect, useState } from "react";
import { useLanguage } from "./context/LanguageContext";
import { useTheme } from "./context/ThemeContext";
import { NeuralBackground } from "./components/Background/NeuralBackground";
import { Navbar, type ViewType } from "./components/Layout/Navbar";
import { Hero } from "./components/Home/Hero";
import { Timeline } from "./components/Home/Timeline";
import { Footer } from "./components/Layout/Footer";
import { ProjectsView } from "./components/Projects/ProjectsView";

function App() {
    useTheme();
    useLanguage();

    const [currentView, setCurrentView] = useState<ViewType>('home');

    const [bgEnabled, setBgEnabled] = useState(() => {
        const saved = localStorage.getItem('app-fx-enabled');
        return saved !== 'false';
    });

    const [quality, setQuality] = useState(() => {
        const saved = localStorage.getItem('app-quality-scale');
        if (saved) return parseFloat(saved);
        return window.innerWidth < 768 ? 0.2 : 0.35;
    });

    useEffect(() => {
        localStorage.setItem('app-fx-enabled', bgEnabled.toString());
    }, [bgEnabled]);

    useEffect(() => {
        localStorage.setItem('app-quality-scale', quality.toString());
    }, [quality]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentView]);

    return (
        <div className="min-h-screen flex flex-col relative text-gray-900 dark:text-gray-100 transition-colors duration-300">

            <div className="bg-grain"></div>
            {bgEnabled && <NeuralBackground quality={quality} />}
            {!bgEnabled && (
                <div className="fixed inset-0 -z-20 bg-gray-100 dark:bg-[#0b1121] transition-colors duration-300" />
            )}

            <Navbar
                bgEnabled={bgEnabled}
                setBgEnabled={setBgEnabled}
                quality={quality}
                setQuality={setQuality}
                currentView={currentView}
                setView={setCurrentView}
            />

            <main className="grow w-full relative z-10">
                <div className="max-w-4xl mx-auto mt-24 mb-12 rounded-2xl shadow-2xl 
                    bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl
                    border border-gray-200 dark:border-zinc-800/50">

                    {currentView === 'home' && (
                        <>
                            <Hero setView={setCurrentView} />

                            <div className="h-px bg-linear-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent mx-12"></div>

                            <Timeline />
                        </>
                    )}

                    {currentView === 'projects' && (
                        <ProjectsView />
                    )}

                </div>

            </main>

            <Footer />

        </div>
    );
}

export default App;