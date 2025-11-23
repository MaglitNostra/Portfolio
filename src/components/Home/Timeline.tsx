import { useLanguage } from '../../context/LanguageContext';
import timelineData from '../../data/timeline.json';

export const Timeline = () => {
    const { language, t } = useLanguage();

    return (
        <section className="py-20 px-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
                {t.timeline.title}
            </h2>

            <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 space-y-12">
                {timelineData.map((item) => {
                    const company = (item.company as any)[language];
                    const date = (item.date as any)[language];
                    const position = (item.position as any)[language];
                    const desc = (item.description as any)[language];

                    return (
                        <div key={item.id} className="relative ml-10 group">
                            <span className="absolute -left-[53px] top-1.5 flex items-center justify-center w-6 h-6 
                                bg-white dark:bg-[#0f172a] rounded-full ring-4 ring-white dark:ring-[#0f172a]">
                                <span className="w-2.5 h-2.5 bg-[#055df5] rounded-full group-hover:scale-125 
                                    transition-transform duration-300 relative z-10"></span>
                                <span className="absolute w-full h-full rounded-full bg-[#055df5]/30 animate-pulse-ring"></span>
                            </span>

                            <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-gray-100 
                                dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {company}
                                    </h3>
                                    <span className="text-sm font-mono text-[#055df5] dark:text-[#055df5] 
                                        bg-blue-50 dark:bg-[#055df5]/10 px-2 py-1 rounded mt-2 sm:mt-0 w-fit">
                                        {date}
                                    </span>
                                </div>
                                <p className="text-base font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    {position}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};