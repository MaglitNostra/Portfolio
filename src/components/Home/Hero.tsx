import { useLanguage } from '../../context/LanguageContext';
import type { ViewType } from '../Layout/Navbar';
import { GithubIcon, LinkedinIcon, MailIcon } from '../UI/Icons';

interface HeroProps {
    setView: (view: ViewType) => void;
}

export const Hero = ({ setView }: HeroProps) => {
    const { t } = useLanguage();

    return (
        <section className="relative py-16 px-8 md:px-12">
            <div className="max-w-3xl">
                <div className="mb-8 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-700 shadow-lg w-fit max-w-full">

                    <div className="bg-gray-200 dark:bg-zinc-800 px-4 py-2 flex items-center gap-2 border-b border-gray-300 dark:border-zinc-700">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>

                    <div className="bg-[#f3f4f6] dark:bg-[#18181b] p-6 font-mono">
                        <div className="flex flex-wrap items-center gap-3 text-xl md:text-2xl text-gray-700 dark:text-gray-300">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">root@MaglitNostra:~#</span>


                            <span>{t.hero.im_a}</span>

                            <span className="text-animation">
                                <span></span>
                            </span>
                        </div>
                    </div>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto text-center">
                    {t.hero.description}
                </p>


                <div className="flex items-center justify-center gap-10 mb-10">
                    <button
                        onClick={() => setView('projects')}
                        className="bg-[#055df5] text-white font-bold text-2xl py-3 px-16 rounded-full shadow-xl hover:shadow-2xl hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        {t.hero.cta}
                    </button>
                </div>

                <div className="flex items-center justify-center gap-6">
                    <a href="https://github.com/MaglitNostra" target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-blue-100 dark:hover:bg-[#055df5]/20 hover:text-[#055df5] dark:hover:text-[#055df5] transition-all group">
                        <GithubIcon className="w-6 h-6" />
                    </a>
                    <a href="https://www.linkedin.com/in/dominik-boniecki-995027313/" target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-blue-100 dark:hover:bg-[#055df5]/20 hover:text-[#055df5] dark:hover:text-[#055df5] transition-all group">
                        <LinkedinIcon className="w-6 h-6" />
                    </a>
                    <a href="mailto:maglit.nostra@gmail.com" className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-blue-100 dark:hover:bg-[#055df5]/20 hover:text-[#055df5] dark:hover:text-[#055df5] transition-all group">
                        <MailIcon className="w-6 h-6" />
                    </a>
                </div>
            </div>
        </section >
    );
};