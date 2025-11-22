import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import projectsData from './data/projects.json';

function App() {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const firstProject = projectsData[0];
    const projectDesc = (firstProject.shortDesc as any)[language];

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-5">

            <div className="max-w-2xl w-full space-y-8">
                <div className="border p-5 rounded-lg border-gray-300 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-2">1. Language Test</h2>
                    <p className="text-lg mb-4">Current language: <span className="font-bold uppercase">{language}</span></p>
                    <p className="italic mb-4">Translation from file (Role): "{t.hero.role}"</p>
                    <div className="flex gap-4">
                        <button onClick={() => setLanguage('pl')} className="px-4 py-2 bg-blue-500 text-white rounded">Polish</button>
                        <button onClick={() => setLanguage('en')} className="px-4 py-2 bg-blue-600 text-white rounded">English</button>
                    </div>
                </div>

                <div className="border p-5 rounded-lg border-gray-300 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-2">2. Theme Test</h2>
                    <p className="text-lg mb-4">Aktualny motyw: <span className="font-bold uppercase">{theme}</span></p>
                    <button onClick={toggleTheme} className="px-4 py-2 bg-purple-600 text-white rounded">
                        Przełącz Motyw
                    </button>
                </div>

                <div className="border p-5 rounded-lg border-gray-300 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-2">3. Data Test (JSON)</h2>
                    <div className="bg-white dark:bg-black/20 p-4 rounded">
                        <h3 className="font-bold text-xl">{firstProject.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{firstProject.tags.join(', ')}</p>
                        <p className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
                            {projectDesc}
                            <br />
                            <span className="text-xs opacity-70">(This sentence changes automatically when you change the language above.)</span>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default App;