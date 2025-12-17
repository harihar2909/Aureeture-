"use client";

import React, { FC, ReactNode, useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Clock,
  Search,
  Brain,
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
  Loader2,
  CheckSquare,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/nextjs";
import { api } from "@/lib/api";

// --- WIDGET WRAPPER COMPONENT ---
const Widget: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    className={`bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

// --- TYPES ---

type ProjectDifficulty = "Beginner" | "Intermediate" | "Advanced";

type Project = {
  id: string;
  title: string;
  company: string;
  duration: string;
  technologies: string[];
  description: string;
  difficulty: ProjectDifficulty;
  requirements: string[];
  deliverables: string[];
  status: string;
  participantsCount: number;
  maxParticipants: number;
};

// Fallback demo data (used when backend has no data / unreachable)
const fallbackProjects: Project[] = [
  {
    id: "demo-1",
    title: "Aureeture Campus Ambassador Portal",
    company: "Aureeture",
    duration: "10 weeks",
    technologies: ["Next.js", "Tailwind CSS", "Supabase"],
    description:
      "Build a portal for managing the campus ambassador program, including tasks and leaderboards.",
    difficulty: "Intermediate",
    requirements: ["Basic React knowledge", "Comfort with APIs"],
    deliverables: [
      "Functional user authentication",
      "Task submission module",
      "Real-time leaderboard",
    ],
    status: "Open",
    participantsCount: 0,
    maxParticipants: 10,
  },
  {
    id: "demo-2",
    title: "AI-Powered Content Summarizer",
    company: "InnovateAI",
    duration: "6 weeks",
    technologies: ["Python", "Hugging Face", "FastAPI"],
    description:
      "Build a web service that summarizes long articles and documents using transformer models.",
    difficulty: "Advanced",
    requirements: ["Python", "REST APIs", "NLP basics"],
    deliverables: ["Summarization API", "Docker deployment", "Docs"],
    status: "Open",
    participantsCount: 0,
    maxParticipants: 5,
  },
];

// --- MODAL COMPONENT ---
const ProjectDetailModal: FC<{
  project: Project | null;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const { isLoaded, isSignedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!project) {
      setIsSubmitting(false);
      setHasJoined(false);
      setError(null);
    }
  }, [project]);

  const handleJoin = async () => {
    if (!project) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (!isLoaded || !isSignedIn) {
        throw new Error("Please sign in to join a project.");
      }
      // Demo projects cannot be joined on the backend
      if (project.id.startsWith("demo-")) {
        setHasJoined(true);
        return;
      }
      const result = await api.projects.join(project.id);
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to join project");
      }
      setHasJoined(true);
    } catch (e: any) {
      setError(e?.message || "Failed to join project");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant="outline">Real-Time Project</Badge>
                <h2 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {project.title}
                </h2>
                <p className="font-semibold text-zinc-500">{project.company}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="mt-6 grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Project Description</h3>
                  <p className="text-sm text-zinc-500">{project.description}</p>
                </div>

                {project.deliverables.length > 0 && (
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                      <CheckSquare size={20} /> Key Deliverables
                    </h3>
                    <ul className="list-inside list-disc space-y-1 text-sm text-zinc-500">
                      {project.deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.requirements.length > 0 && (
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                      <Brain size={20} /> Requirements
                    </h3>
                    <ul className="list-inside list-disc space-y-1 text-sm text-zinc-500">
                      {project.requirements.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <Widget className="bg-zinc-50 p-4 dark:bg-zinc-900/50">
                  <div className="space-y-2 text-center">
                    <div className="text-lg font-bold">Status</div>
                    <div className="text-sm text-zinc-700 dark:text-zinc-200">
                      {project.status}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {project.participantsCount}/{project.maxParticipants} participants
                    </div>
                  </div>
                </Widget>

                <div className="space-y-3">
                  <h4 className="font-semibold">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Info</h4>
                  <div className="space-y-2 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {project.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      Open for applications
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <Button
                  className="w-full font-bold"
                  type="button"
                  disabled={isSubmitting || hasJoined || project.status !== "Open"}
                  onClick={handleJoin}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {hasJoined
                    ? "Joined"
                    : project.status !== "Open"
                      ? "Not open"
                      : "Join Project"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function StudentProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<
    ProjectDifficulty | "All"
  >("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await api.projects.list({ page: "1", limit: "50" });
        if (!result.success) throw new Error(result.error?.message);

        const payload = result.data as any;
        const apiProjects = (payload?.projects || []).map((p: any) => {
          return {
            id: String(p._id),
            title: p.title,
            company: p.company,
            duration: p.duration,
            technologies: p.technologies || [],
            description: p.description,
            difficulty: p.difficulty,
            requirements: p.requirements || [],
            deliverables: p.deliverables || [],
            status: p.status,
            participantsCount: Array.isArray(p.participants)
              ? p.participants.length
              : 0,
            maxParticipants: p.maxParticipants ?? 0,
          } as Project;
        });

        setProjects(apiProjects.length > 0 ? apiProjects : fallbackProjects);
      } catch {
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects
      .filter(
        (project) =>
          filterDifficulty === "All" || project.difficulty === filterDifficulty
      )
      .filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, filterDifficulty, projects]);

  const getDifficultyBadge = (difficulty: ProjectDifficulty) => {
    return "bg-zinc-900/5 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Real-Time Projects</h1>
        <p className="text-sm text-zinc-500">
          Work on live, outcome-driven projects to build your portfolio.
        </p>
      </div>

      <main className="space-y-6">
        <Widget className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by project title..."
                className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-zinc-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 gap-2"
                  >
                    <Filter size={14} />
                    {filterDifficulty}
                    <ChevronDown size={14} className="opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {(["All", "Beginner", "Intermediate", "Advanced"] as const).map(
                    (d) => (
                      <DropdownMenuItem key={d} onClick={() => setFilterDifficulty(d as any)}>
                        {d}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-9 border border-zinc-200 dark:border-zinc-800 rounded-md flex p-0.5 bg-white dark:bg-zinc-900">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-2.5 rounded-sm flex items-center justify-center transition-all ${
                    viewMode === "grid"
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                      : "text-zinc-400"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-2.5 rounded-sm flex items-center justify-center transition-all ${
                    viewMode === "list"
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                      : "text-zinc-400"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </Widget>

        <section>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading projects...
              </div>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Widget className="h-full flex flex-col p-6">
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                            {project.company}
                          </p>
                          <Badge variant="outline" className="text-xs font-normal">
                            {project.status}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                          {project.title}
                        </h3>
                        <p className="text-sm text-zinc-500 mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="outline"
                              className="border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center text-sm text-zinc-500 mb-4">
                          <span className="flex items-center gap-1.5">
                            <Clock size={16} />
                            {project.duration}
                          </span>
                          <Badge
                            variant="outline"
                            className={getDifficultyBadge(project.difficulty)}
                          >
                            {project.difficulty}
                          </Badge>
                        </div>
                        <Button className="w-full" onClick={() => setSelectedProject(project)}>
                          View Project
                        </Button>
                      </div>
                    </Widget>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800"
            >
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                No projects found
              </p>
              <p className="text-zinc-500">Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </section>
      </main>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
