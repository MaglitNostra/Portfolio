export const Footer = () => {
    return (
        <footer className="w-full py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t 
            border-gray-200 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-sm mt-auto">
            <p>© {new Date().getFullYear()} Dominik Boniecki | All Rights Reserved</p>
        </footer>
    );
};