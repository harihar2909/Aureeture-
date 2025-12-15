"use client";

import React, { FC, ReactNode, useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Rocket, Users, Clock, Search, Code, X, Award, IndianRupee, 
  CheckSquare, Brain, Briefcase, Filter, LayoutGrid, List, ChevronDown, Loader2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
type BaseProject = {
  id: number;
  title: string;
  company: string;
  duration: string;
  technologies: string[];
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  aboutCompany: string;
  deliverables: string[];
  learningOutcomes: string[];
};

type InternshipProject = BaseProject & { type: 'Internship Project'; stipend: string; ppo: boolean; };
type LiveProject = BaseProject & { type: 'Live Project'; budget: number; };
type DesignGig = BaseProject & { type: 'Design Gig'; budget: number; };
type Hackathon = BaseProject & { type: 'Hackathon'; prizePool: number; };

type Project = InternshipProject | LiveProject | DesignGig | Hackathon;

// --- DATA ---
const projectsData: Project[] = [
  { 
    id: 5, type: "Internship Project", title: "Aureeture Campus Ambassador Portal", company: "Aureeture", 
    duration: "10 weeks", technologies: ["Next.js", "Tailwind CSS", "Supabase"], 
    description: "Build a portal for managing the campus ambassador program, including tasks and leaderboards.", 
    difficulty: "Intermediate", stipend: "₹15,000 / month", ppo: true,
    aboutCompany: "Aureeture is India’s first GenAI-powered entrepreneurial platform for students, blending education with innovation.",
    deliverables: ["Functional user authentication", "Task submission module", "Real-time leaderboard"],
    learningOutcomes: ["Full-stack development with Next.js", "Database management with Supabase", "Project management skills"]
  },
  { 
    id: 2, type: "Live Project", title: "AI-Powered Content Summarizer", company: "InnovateAI", 
    duration: "6 weeks", technologies: ["Python", "Hugging Face", "FastAPI"], 
    description: "Build a web service that summarizes long articles and documents using transformer models.", 
    difficulty: "Advanced", budget: 40000,
    aboutCompany: "InnovateAI is a research lab focused on making cutting-edge AI accessible to businesses.",
    deliverables: ["REST API for text summarization", "Deployment script (Docker)", "Technical documentation"],
    learningOutcomes: ["NLP with Hugging Face", "API development in Python", "Model deployment"]
  },
  { 
    id: 3, type: "Design Gig", title: "Fintech Landing Page Design", company: "PaySphere", 
    duration: "2 weeks", technologies: ["Figma", "UI/UX", "Webflow"], 
    description: "Design a high-converting, modern landing page for a new fintech startup.", 
    difficulty: "Beginner", budget: 25000,
    aboutCompany: "PaySphere aims to simplify cross-border payments for small businesses in India.",
    deliverables: ["High-fidelity Figma mockups", "Clickable prototype", "Style guide"],
    learningOutcomes: ["UI/UX design principles", "Conversion-centered design", "Figma proficiency"]
  },
  { 
    id: 6, type: "Hackathon", title: "Sustainable Tech Hackathon", company: "GreenCode", 
    duration: "48 hours", technologies: ["Any", "Cloud", "APIs"], 
    description: "Compete to build an innovative solution for environmental sustainability.", 
    difficulty: "Advanced", prizePool: 100000,
    aboutCompany: "GreenCode is a non-profit organization promoting technology for environmental good.",
    deliverables: ["Working prototype", "5-minute video presentation", "Source code repository"],
    learningOutcomes: ["Rapid prototyping", "Team collaboration", "Pitching an idea under pressure"]
  },
];

// --- MODAL COMPONENT ---
const ProjectDetailModal: FC<{ project: Project | null; onClose: () => void }> = ({
  project,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Reset state whenever a new project is opened/closed
  useEffect(() => {
    if (!project) {
      setIsSubmitting(false);
      setHasApplied(false);
    }
  }, [project]);

  const handlePrimaryAction = async () => {
    if (!project) return;
    try {
      setIsSubmitting(true);
      // Placeholder for real API integration
      await new Promise((resolve) => setTimeout(resolve, 800));
      setHasApplied(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCtaLabel = () => {
    if (!project) return "";
    if (project.type === "Internship Project") return "Apply for Internship";
    if (project.type === "Live Project" || project.type === "Design Gig")
      return "Submit Proposal";
    if (project.type === "Hackathon") return "Register for Hackathon";
    return "Continue";
  };

  return (
    <AnimatePresence>
      {project && (
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
                  <Badge variant="outline">{project.type}</Badge>
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
                    <h3 className="mb-2 text-lg font-semibold">
                      About the Company
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {project.aboutCompany}
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      Project Description
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {project.description}
                    </p>
                  </div>
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
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                      <Brain size={20} /> Learning Outcomes
                    </h3>
                    <ul className="list-inside list-disc space-y-1 text-sm text-zinc-500">
                      {project.learningOutcomes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-6">
                  <Widget className="bg-zinc-50 p-4 dark:bg-zinc-900/50">
                    {project.type === "Internship Project" && (
                      <div className="space-y-3">
                        <div className="text-center text-lg font-bold">
                          Internship Details
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IndianRupee size={18} /> Stipend:{" "}
                          <span className="font-semibold">
                            {project.stipend}
                          </span>
                        </div>
                        {project.ppo && (
                          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                            <Award size={18} />
                            PPO Opportunity
                          </div>
                        )}
                      </div>
                    )}
                    {(project.type === "Live Project" ||
                      project.type === "Design Gig") && (
                      <div className="space-y-2 text-center">
                        <div className="text-lg font-bold">Project Budget</div>
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                          ₹{project.budget.toLocaleString("en-IN")}
                        </div>
                      </div>
                    )}
                    {project.type === "Hackathon" && (
                      <div className="space-y-2 text-center">
                        <div className="text-lg font-bold">Prize Pool</div>
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                          ₹{project.prizePool.toLocaleString("en-IN")}
                        </div>
                      </div>
                    )}
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
                        Open for Applications
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full font-bold"
                    type="button"
                    disabled={isSubmitting || hasApplied}
                    onClick={handlePrimaryAction}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {hasApplied ? "Application submitted" : getCtaLabel()}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function StudentProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<Project['type'] | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProjects = useMemo(() => {
    return projectsData
      .filter(project => filterType === 'All' || project.type === filterType)
      .filter(project => project.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, filterType]);

  const projectTypes: (Project['type'] | 'All')[] = ['All', 'Internship Project', 'Live Project', 'Hackathon', 'Design Gig'];

  const getDifficultyBadge = (difficulty: Project['difficulty']) => {
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
                    {filterType === "All" ? "All" : filterType}
                    <ChevronDown size={14} className="opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {projectTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => setFilterType(type)}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
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
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            <AnimatePresence>
              {filteredProjects.map(project => (
                <motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                  <Widget className="h-full flex flex-col p-6">
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                          {project.company}
                        </p>
                        <Badge variant="outline" className="text-xs font-normal">
                          {project.type}
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
                        <span className="flex items-center gap-1.5"><Clock size={16}/>{project.duration}</span>
                        <Badge variant="outline" className={getDifficultyBadge(project.difficulty)}>{project.difficulty}</Badge>
                      </div>
                      <Button className="w-full" onClick={() => setSelectedProject(project)}>View Project</Button>
                    </div>
                  </Widget>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filteredProjects.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No projects found</p>
              <p className="text-zinc-500">Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </section>
      </main>
      
      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}