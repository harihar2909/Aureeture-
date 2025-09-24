"use client";

import React, { FC, ReactNode, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
    Rocket, Users, Clock, Search, Code, X, Award, IndianRupee, 
    CheckSquare, Brain, Briefcase 
} from 'lucide-react';

// --- WIDGET WRAPPER COMPONENT ---
const Widget: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
    className={`bg-card/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-border/20 dark:border-white/10 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-black/20 ${className}`}
  >
    {children}
  </motion.div>
);

// --- EXPANDED PROJECT DATA TYPES with DISCRIMINATED UNION ---
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

// --- PROJECT DETAIL MODAL COMPONENT ---
const ProjectDetailModal: FC<{ project: Project | null; onClose: () => void }> = ({ project, onClose }) => (
    <AnimatePresence>
        {project && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-card/80 dark:bg-neutral-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-border/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-8">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <Badge variant="outline">{project.type}</Badge>
                                <h2 className="text-3xl font-bold text-primary mt-2">{project.title}</h2>
                                <p className="text-muted-foreground font-semibold">{project.company}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-6 w-6" /></Button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mt-6">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">About the Company</h3>
                                    <p className="text-sm text-muted-foreground">{project.aboutCompany}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Project Description</h3>
                                    <p className="text-sm text-muted-foreground">{project.description}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><CheckSquare size={20}/> Key Deliverables</h3>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                        {project.deliverables.map(item => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Brain size={20}/> Learning Outcomes</h3>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                        {project.learningOutcomes.map(item => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <Widget className="p-4">
                                    {project.type === 'Internship Project' && (
                                        <div className="space-y-3">
                                            <div className="font-bold text-lg text-center">Internship Details</div>
                                            <div className="flex items-center gap-2"><IndianRupee size={18}/> Stipend: <span className="font-semibold">{project.stipend}</span></div>
                                            {project.ppo && <div className="flex items-center gap-2 text-green-400"><Award size={18}/> PPO Opportunity</div>}
                                        </div>
                                    )}
                                    {(project.type === 'Live Project' || project.type === 'Design Gig') && (
                                         <div className="space-y-2 text-center">
                                             <div className="font-bold text-lg">Project Budget</div>
                                             <div className="text-3xl font-bold text-primary">₹{project.budget.toLocaleString('en-IN')}</div>
                                         </div>
                                    )}
                                    {project.type === 'Hackathon' && (
                                         <div className="space-y-2 text-center">
                                             <div className="font-bold text-lg">Prize Pool</div>
                                             <div className="text-3xl font-bold text-primary">₹{project.prizePool.toLocaleString('en-IN')}</div>
                                         </div>
                                    )}
                                </Widget>
                                <div className="space-y-3">
                                     <h4 className="font-semibold">Tech Stack</h4>
                                     <div className="flex flex-wrap gap-2">{project.technologies.map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}</div>
                                </div>
                                <div className="space-y-3">
                                     <h4 className="font-semibold">Info</h4>
                                     <div className="text-sm text-muted-foreground space-y-2">
                                        <div className="flex items-center gap-2"><Clock size={16}/>{project.duration}</div>
                                        <div className="flex items-center gap-2"><Users size={16}/>Open for Applications</div>
                                     </div>
                                </div>
                                 <Button className="w-full font-bold">
                                    {project.type === 'Internship Project' && 'Apply for Internship'}
                                    {project.type === 'Live Project' && 'Submit Proposal'}
                                    {project.type === 'Design Gig' && 'Submit Proposal'}
                                    {project.type === 'Hackathon' && 'Register for Hackathon'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// --- MAIN PAGE COMPONENT ---
const RealTimeProjectsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<Project['type'] | 'All'>('All');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const filteredProjects = useMemo(() => {
        return projectsData
            .filter(project => filterType === 'All' || project.type === filterType)
            .filter(project => project.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, filterType]);

    const projectTypes: (Project['type'] | 'All')[] = ['All', 'Internship Project', 'Live Project', 'Hackathon', 'Design Gig'];

    const getDifficultyBadge = (difficulty: Project['difficulty']) => {
        if (difficulty === 'Beginner') return 'bg-green-500/20 text-green-300 border-green-500/30';
        if (difficulty === 'Intermediate') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    };

  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden p-4 md:p-6 lg:p-8">
        {/* Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-aurora-1"></div>
            <div className="absolute w-[400px] h-[400px] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-aurora-2"></div>
        </div>
        <div className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20800%20800%22%3E%3Cdefs%3E%3Cfilter%20id%3D%22a%22%20x%3D%22-50%25%22%20y%3D%22-50%25%22%20width%3D%22200%25%22%20height%3D%22200%25%22%20color-interpolation-filters%3D%22sRGB%22%3E%3CfeTurbulence%20baseFrequency%3D%22.7%22%20seed%3D%221%22%20stitchTiles%3D%22stitch%22/%3E%3CfeColorMatrix%20values%3D%220%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20.07%200%22/%3E%3C/filter%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23a)%22/%3E%3C/svg%3E')] opacity-20 -z-10"></div>

        <main className="max-w-7xl mx-auto space-y-8">
            <motion.header 
                initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center space-x-4"
            >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Real-Time Projects</h1>
                    <p className="text-muted-foreground">Engage with live industry projects, internships, and hackathons.</p>
                </div>
            </motion.header>

            <Widget className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                        <Input placeholder="Search by project title..." className="pl-10 h-11" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                        {projectTypes.map(type => (
                            <Button key={type} variant={filterType === type ? 'default' : 'secondary'} onClick={() => setFilterType(type)} className="flex-shrink-0">{type}</Button>
                        ))}
                    </div>
                </div>
            </Widget>

            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredProjects.map(project => (
                            <motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                                <Widget className="h-full flex flex-col p-6">
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm font-semibold text-primary">{project.company}</p>
                                            <Badge variant="outline">{project.type}</Badge>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map(tech => <Badge key={tech}>{tech}</Badge>)}
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-border/20">
                                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                                            <span className="flex items-center gap-1.5"><Clock size={16}/>{project.duration}</span>
                                            <Badge className={getDifficultyBadge(project.difficulty)}>{project.difficulty}</Badge>
                                        </div>
                                        <Button className="w-full" onClick={() => setSelectedProject(project)}>View Project</Button>
                                    </div>
                                </Widget>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                {filteredProjects.length === 0 && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-card/60 rounded-2xl">
                        <p className="text-lg font-semibold">No projects found</p>
                        <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                     </motion.div>
                )}
            </section>
        </main>
        
        <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
};

export default RealTimeProjectsPage;