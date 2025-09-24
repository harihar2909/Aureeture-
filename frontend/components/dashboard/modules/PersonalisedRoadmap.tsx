"use client";

import React, { FC, ReactNode, useState, useLayoutEffect, useRef } from 'react'; // Changed to useLayoutEffect
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Target, X, CheckCircle, Circle, Clock, Bot, RefreshCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// --- WIDGET WRAPPER COMPONENT ---
const Widget: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
    className={`
      bg-card/60 dark:bg-neutral-900/60
      backdrop-blur-xl
      border border-border/20 dark:border-white/10
      rounded-2xl
      shadow-lg dark:shadow-2xl dark:shadow-black/20
      transition-all duration-300
      ${className}
    `}
  >
    {children}
  </motion.div>
);

// --- TYPES ---
type RoadmapStep = {
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'active' | 'upcoming' | 'locked';
    skills: string[];
    pathId: 'main' | 'branch';
    position: number;
};
type PathSet = {
    main: string;
    branch: string;
};

// --- DATA & PATHS (Moved outside component) ---
const defaultPaths: PathSet = {
    main: "M100,700 C 150,500 300,500 350,600 S 450,800 550,700 S 700,500 750,400 S 850,200 950,250 S 1100,400 1100,400",
    branch: "M750,400 C 780,300 850,280 900,350 S 1000,500 1050,550"
};
const aiPaths: PathSet = {
    main: "M150,700 L 350,650 L 550,750 L 750,400 L 950,200 L 1100,400",
    branch: "M750,400 C 800,300 850,300 900,400 L 1050,550"
};
const gamePaths: PathSet = {
    main: "M100,700 C 200,400 300,800 500,600 C 700,400 800,800 950,500 S 1100,400 1100,400",
    branch: "M950,500 C 900,650 1000,700 1050,550"
};

const initialRoadmapSteps: RoadmapStep[] = [
    { id: 1, title: "Foundation Skills", description: "A huge milestone! You've successfully mastered the core languages of the web...", status: "completed", skills: ["HTML", "CSS", "JavaScript"], pathId: 'main', position: 0.05 },
    { id: 2, title: "Frontend Frameworks", description: "You're currently diving deep into the world of modern user interfaces with React...", status: "active", skills: ["React", "TypeScript", "Tailwind CSS"], pathId: 'main', position: 0.3 },
    { id: 3, title: "Backend Development", description: "Get ready to build the engine of your application...", status: "upcoming", skills: ["Node.js", "Express", "MongoDB"], pathId: 'main', position: 0.65 },
    { id: 4, title: "Full-Stack Projects", description: "This is where your vision comes to life...", status: "locked", skills: ["MERN Stack", "Deployment", "Testing"], pathId: 'branch', position: 0.5 },
    { id: 5, title: "Advanced Concepts", description: "Prepare to scale. This future stage moves beyond a single application...", status: "locked", skills: ["Microservices", "DevOps", "System Design"], pathId: 'main', position: 0.95 }
];
const customRoadmapSteps: RoadmapStep[] = [
    { id: 1, title: "Python & Math Foundations", description: "Start with the essentials. Master Python programming and core mathematical concepts...", status: "completed", skills: ["Python", "NumPy", "Pandas", "Linear Algebra"], pathId: 'main', position: 0.1 },
    { id: 2, title: "Core Machine Learning", description: "Dive into classical machine learning algorithms...", status: "active", skills: ["Scikit-learn", "Supervised Learning", "Unsupervised Learning"], pathId: 'main', position: 0.4 },
    { id: 3, title: "Deep Learning Specialization", description: "Build neural networks from the ground up...", status: "upcoming", skills: ["TensorFlow", "PyTorch", "Neural Networks"], pathId: 'branch', position: 0.5 },
    { id: 4, title: "Data Engineering & MLOps", description: "Learn to deploy and maintain ML models in production...", status: "locked", skills: ["Docker", "Kubernetes", "Airflow", "MLFlow"], pathId: 'main', position: 0.8 },
];
const gameDevRoadmapSteps: RoadmapStep[] = [
    { id: 1, title: "C# & Unity Basics", description: "Begin your journey by mastering C# scripting and the Unity editor...", status: "completed", skills: ["C#", "Unity Editor", "Game Objects", "Prefabs"], pathId: 'main', position: 0.1 },
    { id: 2, title: "2D Game Development", description: "You're now building your first 2D games! This involves working with sprites...", status: "active", skills: ["Sprite Kit", "2D Physics", "Tilemaps", "UI Canvas"], pathId: 'main', position: 0.4 },
    { id: 3, title: "3D Game Development", description: "Step into the third dimension. You will learn about 3D modeling...", status: "upcoming", skills: ["3D Modeling", "Shaders", "Lighting", "Animation"], pathId: 'branch', position: 0.5 },
    { id: 4, title: "Optimization & Deployment", description: "The final hurdle: making sure your game runs smoothly...", status: "locked", skills: ["Performance", "Asset Bundles", "App Stores"], pathId: 'main', position: 0.8 },
];

// --- MAIN COMPONENT ---
const PersonalisedRoadmap: React.FC = () => {
    const [roadmapData, setRoadmapData] = useState<RoadmapStep[]>(initialRoadmapSteps);
    const [currentPaths, setCurrentPaths] = useState<PathSet>(defaultPaths);
    const [selectedMilestone, setSelectedMilestone] = useState<RoadmapStep | null>(null);
    const [milestoneCoords, setMilestoneCoords] = useState<{ [key: number]: { x: number, y: number } }>({});
    const [isCustomizeModalOpen, setCustomizeModalOpen] = useState(false);
    const [customPathInput, setCustomPathInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const mainPathRef = useRef<SVGPathElement>(null);
    const branchPathRef = useRef<SVGPathElement>(null);

    // --- FIX: Use useLayoutEffect to calculate coordinates AFTER DOM updates ---
    useLayoutEffect(() => {
        const completedSteps = roadmapData.filter(step => step.status === 'completed').length;
        const totalSteps = roadmapData.length;
        setProgress(totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0);
        
        const calculateCoords = () => {
            const coords: { [key: number]: { x: number, y: number } } = {};
            const mainPath = mainPathRef.current;
            const branchPath = branchPathRef.current;
            if (mainPath && branchPath) {
                roadmapData.forEach(step => {
                    const targetPath = step.pathId === 'main' ? mainPath : branchPath;
                    if (targetPath?.getTotalLength() > 0) {
                        const point = targetPath.getPointAtLength(targetPath.getTotalLength() * step.position);
                        coords[step.id] = { x: point.x, y: point.y };
                    }
                });
                setMilestoneCoords(coords);
            }
        };

        // No timeout needed, useLayoutEffect ensures the DOM is ready
        calculateCoords(); 
        
        const observer = new ResizeObserver(calculateCoords);
        if (document.body) observer.observe(document.body);
        return () => {
            if (document.body) observer.unobserve(document.body);
        };
    }, [roadmapData, currentPaths]);
    
    // --- HANDLERS ---
    const handleMilestoneClick = (step: RoadmapStep) => {
        if(step.status !== 'locked') setSelectedMilestone(step);
    };
    const closePanel = () => setSelectedMilestone(null);
    const openCustomizeModal = () => setCustomizeModalOpen(true);
    const closeCustomizeModal = () => setCustomizeModalOpen(false);

    const handleGenerateRoadmap = () => {
        setIsGenerating(true);
        closeCustomizeModal();
        setTimeout(() => {
            const input = customPathInput.toLowerCase();
            if (input.includes('game')) {
                setRoadmapData(gameDevRoadmapSteps);
                setCurrentPaths(gamePaths);
            } else if (input.includes('ai') || input.includes('machine learning')) {
                setRoadmapData(customRoadmapSteps);
                setCurrentPaths(aiPaths);
            } else {
                setRoadmapData(initialRoadmapSteps);
                setCurrentPaths(defaultPaths);
            }
            setIsGenerating(false);
            setCustomPathInput('');
        }, 2000);
    };
    const handleResetRoadmap = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setRoadmapData(initialRoadmapSteps);
            setCurrentPaths(defaultPaths);
            setIsGenerating(false);
        }, 1000);
    };

    const getStatusProps = (status: RoadmapStep['status']) => {
        switch (status) {
            case 'completed': return { dotFill: '#22c55e', ringFill: '#22c55e' };
            case 'active': return { dotFill: '#3b82f6', ringFill: '#3b82f6' };
            case 'upcoming': return { dotFill: '#facc15', ringFill: '#facc15' };
            default: return { dotFill: '#6b7280', ringFill: '#6b7280' };
        }
    };

    return (
        <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-6 lg:p-8 relative overflow-hidden">
            <style>{`
                .road-path { stroke-dasharray: 4000; stroke-dashoffset: 4000; animation: drawRoad 8s ease-in-out forwards; }
                @keyframes drawRoad { to { stroke-dashoffset: 0; } }
                .milestone-marker { cursor: pointer; transition: transform 0.3s ease; }
                .milestone-marker.locked { cursor: not-allowed; }
                .milestone-marker:not(.locked):hover .milestone-label { transform: scale(1.1) translateY(-5px); }
                .milestone-label {
                    font-size: 14px;
                    fill: hsl(var(--muted-foreground)); /* THEME-AWARE TEXT COLOR */
                    transition: transform 0.3s ease;
                    transform-origin: center center;
                }
                @keyframes pulse-ring { 0%, 100% { transform: scale(1.2); opacity: 0; } 50% { transform: scale(2.5); opacity: 0.3; } }
                .milestone-marker.active .milestone-outer-ring { animation: pulse-ring 2s infinite ease-out; }
            `}</style>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute w-[500px] h-[500px] bg-purple-500/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-aurora-1"></div>
                <div className="absolute w-[400px] h-[400px] bg-blue-500/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-aurora-2"></div>
            </div>
            <div className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20800%20800%22%3E%3Cdefs%3E%3Cfilter%20id%3D%22a%22%20x%3D%22-50%25%22%20y%3D%22-50%25%22%20width%3D%22200%25%22%20height%3D%22200%25%22%20color-interpolation-filters%3D%22sRGB%22%3E%3CfeTurbulence%20baseFrequency%3D%22.7%22%20seed%3D%221%22%20stitchTiles%3D%22stitch%22/%3E%3CfeColorMatrix%20values%3D%220%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20.07%200%22/%3E%3C/filter%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23a)%22/%3E%3C/svg%3E')] opacity-20 -z-10"></div>

            <main className="max-w-7xl mx-auto w-full">
                <motion.header initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center">
                        <Map className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Personalised Roadmap</h1>
                        <p className="text-muted-foreground">Your journey from idea to impact, powered by GenAI.</p>
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 gap-6">
                    <Widget className="lg:col-span-4">
                        <CardHeader>
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2">Your Learning Journey</CardTitle>
                                    <p className="text-muted-foreground text-sm mt-1">Overall Progress: {Math.round(progress)}%</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="secondary" onClick={openCustomizeModal}><Target className="w-4 h-4 mr-2" />Customize Path</Button>
                                    <Button variant="ghost" size="icon" onClick={handleResetRoadmap} title="Reset to Original Path"><RefreshCcw className="w-5 h-5" /></Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[60vh] md:h-[70vh] p-0 md:p-2">
                            <AnimatePresence mode="wait">
                                {/* FIX: Key now depends on paths too, ensuring a full re-render on layout change */}
                                <motion.div key={JSON.stringify(roadmapData) + JSON.stringify(currentPaths)} className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                                    <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet">
                                        <defs><filter id="glow"><feGaussianBlur stdDeviation="3.5" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                                        <path ref={mainPathRef} className="road-path" d={currentPaths.main} stroke="hsl(var(--border))" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#glow)"/>
                                        <path ref={branchPathRef} className="road-path" d={currentPaths.branch} stroke="hsl(var(--border))" strokeWidth="8" fill="none" strokeLinecap="round" style={{ animationDelay: '2s' }} filter="url(#glow)"/>
                                        {Object.keys(milestoneCoords).length > 0 && roadmapData.map(step => {
                                            const { dotFill, ringFill } = getStatusProps(step.status);
                                            const isActive = step.status === 'active';
                                            const coords = milestoneCoords[step.id];
                                            if (!coords) return null;
                                            return (
                                                <g key={step.id} className={`milestone-marker ${isActive ? 'active' : ''} ${step.status === 'locked' ? 'locked' : ''}`} transform={`translate(${coords.x}, ${coords.y})`} onClick={() => handleMilestoneClick(step)}>
                                                    <circle className="milestone-outer-ring" r="15" fill={ringFill} opacity={0.4} />
                                                    <circle className="milestone-inner-dot" r="8" fill={dotFill} stroke="hsl(var(--background))" strokeWidth="2" />
                                                    <text className="milestone-label" x="0" y="-25" textAnchor="middle">{step.title}</text>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                </motion.div>
                            </AnimatePresence>
                        </CardContent>
                    </Widget>
                </div>
            </main>

            {/* --- MODALS & OVERLAYS --- */}
            <AnimatePresence>
                 {isGenerating && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
                        <div className="flex flex-col items-center gap-4 text-white p-8 bg-card/60 rounded-2xl border border-border/20">
                            <Bot className="w-12 h-12 text-primary animate-bounce" />
                            <p className="text-xl font-semibold">Generating your personalised path...</p>
                        </div>
                    </motion.div>
                )}
                {selectedMilestone && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={closePanel}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="bg-card/80 dark:bg-neutral-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-11/12 max-w-2xl p-8 border border-border/20" onClick={(e) => e.stopPropagation()}>
                           <div className="flex justify-between items-start">
                                <div>
                                    <Badge className="capitalize">{selectedMilestone.status}</Badge>
                                    <h2 className="text-3xl font-bold text-primary mt-2">{selectedMilestone.title}</h2>
                                    <p className="text-muted-foreground leading-relaxed mt-2">{selectedMilestone.description}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={closePanel}><X className="h-6 w-6" /></Button>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-3">Key Skills to Acquire</h3>
                                <div className="flex flex-wrap gap-2">{selectedMilestone.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div>
                            </div>
                            <div className="mt-8"><Button className="font-bold w-full md:w-auto">{selectedMilestone.status === 'active' ? 'Continue Learning →' : 'Explore Resources →'}</Button></div>
                        </motion.div>
                    </motion.div>
                )}
                {isCustomizeModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeCustomizeModal}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="bg-card/80 dark:bg-neutral-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-11/12 max-w-lg p-8 border border-border/20" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold text-primary">Customize Your Path</h2>
                                <Button variant="ghost" size="icon" onClick={closeCustomizeModal}><X className="h-6 w-6" /></Button>
                            </div>
                            <p className="text-muted-foreground mt-2 mb-4">Describe your desired career goal. Our GenAI will create a tailored roadmap for you.</p>
                            <textarea value={customPathInput} onChange={(e) => setCustomPathInput(e.target.value)} className="w-full p-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" rows={4} placeholder="e.g., 'AI and Machine Learning Engineer' or 'Game Developer'" />
                            <div className="mt-6 flex justify-end">
                                <Button onClick={handleGenerateRoadmap} disabled={!customPathInput} className="font-bold"><Bot className="w-4 h-4 mr-2"/>Generate Roadmap</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PersonalisedRoadmap;