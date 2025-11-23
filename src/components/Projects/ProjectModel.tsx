// components/Projects/ProjectModel.tsx

import { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
    GithubIcon,
    GitLabIcon,
    GlobeIcon,
    SteamIcon,
    NintendoSwitchIcon,
    ItchIoIcon
} from "../UI/Icons";

const linkConfig: { [key: string]: { icon: React.FC<any>; label: string } } = {
    repo: { icon: GithubIcon, label: "Repository" },
    gitlab: { icon: GitLabIcon, label: "GitLab" },
    demo: { icon: GlobeIcon, label: "Live Demo" },
    steam: { icon: SteamIcon, label: "Steam" },
    nintendo: { icon: NintendoSwitchIcon, label: "Nintendo eShop" },
    itchio: { icon: ItchIoIcon, label: "Itch.io" },
};

interface ProjectModelProps {
    project: any;
    onClose: () => void;
}

export const ProjectModel = ({ project, onClose }: ProjectModelProps) => {
    const { language } = useLanguage();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const content = project.content[language];
    const title = project.title;
    const date = project.createdAt;

    const availableLinks = Object.keys(project.links).filter(key => project.links[key]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"></div>

            <div
                className="relative w-full max-w-2xl bg-white dark:bg-[#09090b] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-pulse-ring"
                style={{ animation: 'none' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="shrink-0 flex justify-between items-start p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
                        <span className="text-xs font-mono text-[#055df5]">{date}</span>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {project.image ? (
                        <img
                            src={project.image}
                            alt={title}
                            className="max-w-md mx-auto h-auto max-h-64 rounded-lg mb-6 border dark:border-white/10"
                        />
                    ) : null}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{content}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {project.tags.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {availableLinks.length > 0 && (
                    <div className="shrink-0 p-6 border-t border-gray-100 dark:border-white/5 flex flex-wrap gap-4 bg-gray-50/50 dark:bg-zinc-900/50">
                        {availableLinks.map(key => {
                            const config = linkConfig[key];
                            if (!config) return null;
                            const Icon = config.icon;
                            return (
                                <a
                                    key={key}
                                    href={project.links[key]}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all duration-200 ease-in-out bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-[#055df5] dark:hover:text-[#055df5] hover:border-[#055df5]/50 dark:hover:border-[#055df5] hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                                >
                                    <Icon className="w-5 h-5" /> {config.label}
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};