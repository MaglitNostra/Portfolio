import { useState } from 'react'

function App() {
    const [isDark, setInDark] = useState(false);

    const toggleTheme = () => {
        setInDark(!isDark);

        if (!isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center transition-colors duration-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <h1 className="text-5xl font-bold mb-4">
                Tailwind v4 Działa! 🚀
            </h1>
            <p className="text-xl mb-8">
                To jest Twój nowy start projektu.
            </p>

            <button
                onClick={toggleTheme}
                className="px-6 py-3 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg hover:scale-105"
            >
                {isDark ? '☀️ Przełącz na Jasny' : '🌙 Przełącz na Ciemny'}
            </button>
        </div>
    );
}

export default App;