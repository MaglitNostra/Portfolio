import { useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import projectsData from '../../data/projects.json';
import { ProjectModel } from "./ProjectModel";

export const ProjectsView = () => {
    const { language, t } = useLanguage();

    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        projectsData.forEach(p => p.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags).sort();
    }, []);

    const filteredProjects = useMemo(() => {
        return projectsData.filter(project => {
            const query = search.toLowerCase();
            const matchesSearch =
                project.title.toLowerCase().includes(query) ||
                (project.shortDesc as any)[language].toLowerCase().includes(query);

            const matchesTags = selectedTags.length === 0 ||
                selectedTags.some(tag => project.tags.includes(tag));
            return matchesSearch && matchesTags;
        }).sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [search, selectedTags, language]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <section className="py-12 px-6 md:px-12 min-h-[60vh]">
            <div className="mb-12 space-y-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t.nav.projects}
                    </h2>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder={t.projects.searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5
                                border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white
                                focus:outline-none focus:ring-2 focus:ring-[#055df5] transition-all"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 text-xs font-bold rounded-full transition-all border ${selectedTags.includes(tag)
                                ? 'bg-[#055df5] text-white border-[#055df5]'
                                : 'bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-[#055df5] dark:hover:border-[#055df5]'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                    {selectedTags.length > 0 && (
                        <button onClick={() => setSelectedTags([])} className="px-3 py-1 text-xs text-red-500 hover:underline">
                            Reset
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map(project => (
                    <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="group bg-white dark:bg-white/5 rounded-xl border border-gray-200
                            dark:border-white/5 p-6 cursor-pointer hover:border-[#055df5] dark:hover:border-[#055df5] transition-all
                            hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white 
                            group-hover:text-[#055df5] transition-colors">
                                {project.title}
                            </h3>

                            <span className="text-xs font-mono opacity-50">{project.createdAt}</span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {(project.shortDesc as any)[language]}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {project.tags.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-500">
                                    {tag}
                                </span>
                            ))}
                            {project.tags.length > 3 && <span className="text-[10px] text-gray-500">+{project.tags.length - 3}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    No projects found.
                </div>
            )}

            {selectedProject && (
                <ProjectModel project={selectedProject} onClose={() => setSelectedProject(null)} />
            )}
        </section>
    );
}