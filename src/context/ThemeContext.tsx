import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("app-theme") as Theme;

        if (storedTheme) {
            setTheme(storedTheme);
            updateHtmlClass(storedTheme);
        }
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme("dark");
            updateHtmlClass("dark");
        }

    }, []);

    const updateHtmlClass = (node: Theme) => {
        const root = document.documentElement;
        if (node === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        updateHtmlClass(newTheme);
        localStorage.setItem("app-theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}