"use client";

import React, { FC, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, MapPin, Clock, DollarSign, Bookmark, ArrowRight, 
    Search, Zap, Trophy, Building, TrendingUp, Mail, Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, 
    DialogDescription, DialogFooter 
} from "@/components/ui/dialog";

// --- WIDGET WRAPPER COMPONENT ---
const Widget: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className={`bg-card/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-border/20 dark:border-white/10 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-black/20 h-full ${className}`}
    >
        {children}
    </motion.div>
);

// --- TYPESCRIPT TYPES & MOCK DATA ---
type Job = {
    id: number;
    title: string;
    company: string;
    logoUrl: string;
    location: string;
    type: 'Full-time' | 'Contract' | 'Internship';
    salary: string;
    skills: string[];
    postedDate: string;
    matchScore: number;
    featured?: boolean;
};

const allJobs: Job[] = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: "Aureeture",
        logoUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Aureeture",
        location: "Pune, India",
        type: "Full-time",
        salary: "₹18-25 LPA",
        skills: ["React", "TypeScript", "GenAI APIs", "Next.js"],
        postedDate: "2h ago",
        matchScore: 95,
        featured: true,
    },
    {
        id: 2,
        title: "Full Stack Developer",
        company: "Fintech Innovations",
        logoUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Fintech",
        location: "Mumbai (Remote)",
        type: "Full-time",
        salary: "₹12-20 LPA",
        skills: ["Node.js", "React", "MongoDB", "AWS"],
        postedDate: "1 day ago",
        matchScore: 88,
    },
    {
        id: 3,
        title: "Product Design Intern",
        company: "HealthTech Startup",
        logoUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Health",
        location: "Bangalore",
        type: "Internship",
        salary: "₹30-50k /month",
        skills: ["Figma", "UI/UX", "User Research"],
        postedDate: "3 days ago",
        matchScore: 82,
    }
];

const currentUser = {
    name: "Aarav Sharma",
    email: "aarav.sharma@email.com",
    resume: "Aarav_Sharma_Resume_2025.pdf",
    headline: "Aspiring AI Entrepreneur | B.Tech CSE"
};

// --- MODAL COMPONENT ---
const ApplyModal: FC<{ job: Job | null; user: typeof currentUser; onClose: () => void; }> = ({ job, user, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!job) return null;

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            alert(`Successfully applied for ${job.title} at ${job.company}!`);
            setIsSubmitting(false);
            onClose();
        }, 1500);
    };

    return (
        <Dialog open={!!job} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Apply to {job.title}</DialogTitle>
                    <DialogDescription>Your profile will be shared with {job.company}.</DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                    <div className='flex items-center gap-4 p-4 bg-muted rounded-lg'>
                        <Avatar className="h-16 w-16 border"><AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} /><AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback></Avatar>
                        <div>
                            <h4 className='font-semibold text-lg'>{user.name}</h4>
                            <p className='text-sm text-muted-foreground'>{user.headline}</p>
                        </div>
                    </div>
                    <div className='space-y-2 text-sm'>
                         <p className='flex items-center gap-2'><Mail size={16} className='text-muted-foreground'/>{user.email}</p>
                         <p className='flex items-center gap-2'><Paperclip size={16} className='text-muted-foreground'/>{user.resume}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// --- JOB CARD SUB-COMPONENT (STYLED LIKE PERSONCARD) ---
const JobCard: FC<{ job: Job; index: number; onApplyClick: (job: Job) => void }> = ({ job, index, onApplyClick }) => {
    const getMatchScoreClass = (score: number) => {
        if (score >= 90) return 'bg-green-500/10 text-green-500 border-green-500/20';
        if (score >= 80) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg transition-colors ${job.featured ? 'bg-primary/10 border border-primary/30' : 'bg-background/50 dark:bg-black/20'}`}
        >
            <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 border">
                    <AvatarImage src={job.logoUrl} />
                    <AvatarFallback>{job.company.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{job.title}</h4>
                        <Badge variant="outline" className={getMatchScoreClass(job.matchScore)}>
                            {job.matchScore}% Match
                        </Badge>
                        {job.featured && <Badge>Top Opportunity</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"><Building className="w-3.5 h-3.5" /> {job.company}</p>
                    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.postedDate}</span>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0 self-end sm:self-center">
                <Tooltip><TooltipTrigger asChild><Button size="icon" variant="outline" className="rounded-full"><Bookmark className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Save Job</p></TooltipContent></Tooltip>
                <Button className="rounded-full" onClick={() => onApplyClick(job)}>
                    Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
};

// --- MAIN PAGE COMPONENT ---
const JobFinderPage: FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredJobs, setFilteredJobs] = useState<Job[]>(allJobs);
    const [applyingForJob, setApplyingForJob] = useState<Job | null>(null);

    // Effect to filter jobs when search term changes
    useEffect(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        if (lowercasedTerm === '') {
            setFilteredJobs(allJobs);
        } else {
            const filtered = allJobs.filter(job =>
                job.title.toLowerCase().includes(lowercasedTerm) ||
                job.company.toLowerCase().includes(lowercasedTerm) ||
                job.skills.some(skill => skill.toLowerCase().includes(lowercasedTerm))
            );
            setFilteredJobs(filtered);
        }
    }, [searchTerm]);
    
    const stats = [
        { label: 'New Today', value: '24', color: 'text-green-500', icon: Zap },
        { label: 'Total Matches', value: '156', color: 'text-blue-500', icon: Trophy },
        { label: 'Avg. Match', value: '92%', color: 'text-amber-500', icon: TrendingUp }
    ];

    return (
        <TooltipProvider>
            <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-6 lg:p-8 relative overflow-hidden">
                {/* Backgrounds */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute w-[500px] h-[500px] bg-purple-500/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-aurora-1"></div>
                    <div className="absolute w-[400px] h-[400px] bg-blue-500/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-aurora-2"></div>
                </div>

                <main className="max-w-7xl mx-auto">
                    <motion.header 
                        initial={{ opacity: 0, y: -40 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.6, ease: "easeOut" }} 
                        className="flex items-center space-x-4 mb-8"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center">
                            <Briefcase className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Job Finder</h1>
                            <p className="text-muted-foreground">Discover AI-matched roles to accelerate your career.</p>
                        </div>
                    </motion.header>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <Widget className="lg:col-span-4 p-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                                <div className="lg:col-span-2">
                                    <h3 className="font-semibold mb-2">Find Your Next Opportunity</h3>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by title, company, or skills..."
                                            className="pl-12 h-12 rounded-full bg-background/50 dark:bg-black/20"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    {stats.map(stat => (
                                        <div key={stat.label}>
                                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Widget>

                        <Widget className="lg:col-span-4 p-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Briefcase size={22} />Suggested Opportunities</h2>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {filteredJobs.length > 0 ? (
                                        filteredJobs.map((job, index) => (
                                            <JobCard
                                                key={job.id}
                                                job={job}
                                                index={index}
                                                onApplyClick={() => setApplyingForJob(job)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">No opportunities found matching your search.</p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Widget>
                    </div>
                </main>

                <ApplyModal
                    job={applyingForJob}
                    user={currentUser}
                    onClose={() => setApplyingForJob(null)}
                />
            </div>
        </TooltipProvider>
    );
};

export default JobFinderPage;