// /app/page.tsx
"use client";

/**
 * @fileoverview AureetureAI Platform Landing Page
 * @description
 * ## Engineering Note:
 * This file consolidates all platform journey components into a single file.
 * The content has been updated to reflect the full AureetureAI ecosystem, including the
 * student and enterprise pathways. TypeScript types are used for all data structures.
 *
 * ## UI/UX Philosophy: "Clarity & Momentum"
 * The design uses a professional color palette, modern typography, and subtle animations
 * to create a trustworthy and premium user experience, reflecting the high quality
 * of the Aureeture program.
 */

//================================================================//
//  IMPORTS
//================================================================//
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, easeOut } from "framer-motion";
import {
    ShieldCheck, DollarSign, Rocket, Briefcase, Users, FileSignature, TrendingUp,
    Sparkles, ArrowRight, UserCheck, Bot, Route, FolderKanban,
    LucideIcon, Map, Network, Target, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

//================================================================//
//  TYPE DEFINITIONS
//================================================================//
interface JourneyStep {
    level: string;
    title: string;
    description: string;
    icon: LucideIcon;
    points: string[];
}

interface EnterpriseStep {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface EcosystemFeature {
    icon: LucideIcon;
    title: string;
    forStudents: string;
    forEnterprises: string;
}

interface StudentFeature {
    icon: LucideIcon;
    title: string;
    description: string;
}

//================================================================//
//  ANIMATION VARIANTS
//================================================================//
const FADE_IN_UP = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

//================================================================//
//  STATIC DATA
//================================================================//

// Data for the Student Journey Section
const studentJourneyData: JourneyStep[] = [
    {
        level: "1",
        title: "The Proving Ground",
        description: "Build your proof-of-work with real industry projects, establishing your skills and credibility from day one.",
        icon: ShieldCheck,
        points: [
            "Verified Onboarding: Create a professional, KYC-verified portfolio.",
            "Real Industry Projects: Engage with mentored challenges to build foundational skills.",
            "Dynamic Performance Score: Earn a score reflecting your reliability and quality of work.",
        ],
    },
    {
        level: "2",
        title: "The Freelance Arena",
        description: "Unlock paid gigs in a student-first marketplace with reduced competition and secure payments.",
        icon: DollarSign,
        points: [
            "Access Paid Gigs: High performance unlocks the freelance marketplace.",
            "Secure Escrow Payments: All project funds are secured upfront.",
            "Build Your Reputation: Client reviews boost your score and attract better projects.",
        ],
    },
    {
        level: "3",
        title: "The Career Launchpad",
        description: "Gain exclusive access to premium internships and full-time jobs reserved for top-performing talent.",
        icon: Rocket,
        points: [
            "Become 'Top 5% Talent': Consistently high scores grant you elite status.",
            "Exclusive Opportunities: Access internships and jobs not available elsewhere.",
            "AI-Powered Matching: Get matched with roles that align perfectly with your proven skills.",
        ],
    },
];

// Data for the Enterprise Journey Section
const enterpriseJourneyData: EnterpriseStep[] = [
    { icon: FileSignature, title: "Post an Opportunity", description: "Create a detailed project listing with clear scope, deliverables, and budget to attract the right student talent." },
    { icon: UserCheck, title: "Vet & Hire Proven Talent", description: "Engage with students based on their dynamic Performance Score—investing in demonstrated ability, not just a resume." },
    { icon: Briefcase, title: "Seamless Project Management", description: "Manage projects and provide feedback through the platform, with secure escrow payments protecting every transaction." },
    { icon: TrendingUp, title: "Build Your Talent Pipeline", description: "Use freelance gigs as low-risk trials and seamlessly transition impressive students into internships or full-time roles." },
];

// Data for the Ecosystem Engine Section
const ecosystemFeaturesData: EcosystemFeature[] = [
    { icon: Bot, title: "CARO (AI Assistant)", forStudents: "A mentor-bot providing personalized guidance.", forEnterprises: "AI tools to help craft the perfect project brief." },
    { icon: Route, title: "Pathfinder", forStudents: "Explores career transitions and shows skill gaps.", forEnterprises: "Provides insights into the available talent pool." },
    { icon: FolderKanban, title: "Real-Time Project Hub", forStudents: "Central marketplace for all projects and jobs.", forEnterprises: "Single portal to post opportunities and manage talent." },
];

// Data for Student-Specific Features Section
const studentFeaturesData: StudentFeature[] = [
    {
        icon: Bot,
        title: "CARO (AI Assistant)",
        description: "Personal mentor-bot that provides step-by-step career guidance, project recommendations, and feedback."
    },
    {
        icon: Map,
        title: "Pathfinder",
        description: "Visual roadmap showing career transitions, skill gaps, and required projects to advance."
    },
    {
        icon: FolderKanban,
        title: "Real-Time Project Hub",
        description: "Central marketplace for unpaid projects, freelance gigs, internships, and jobs."
    },
    {
        icon: Target,
        title: "Personalized Roadmaps",
        description: "AI-adaptive career journeys that evolve with each project and performance milestone."
    },
    {
        icon: Network,
        title: "Networking (People Finder)",
        description: "Curated connections with peers, alumni, and industry mentors (with LinkedIn integration)."
    }
];

//================================================================//
//  REUSABLE COMPONENTS
//================================================================//

const GridBackground = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative ${className}`}>
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        {children}
    </div>
);

//================================================================//
//  SECTIONAL COMPONENTS
//================================================================//

const HeroSection = () => (
    <GridBackground className="flex items-center justify-center text-center px-4 min-h-screen">
        <motion.div
            initial="hidden"
            animate="visible"
            variants={STAGGER_CONTAINER}
            className="z-10"
        >
            <motion.h1
                variants={FADE_IN_UP}
                className="text-5xl md:text-7xl lg:text-8xl font-light text-foreground tracking-tight flex flex-wrap items-center justify-center gap-x-4 md:gap-x-8"
            >
                <span>Build</span>
                <span className="text-primary">•</span>
                <span>Launch</span>
                <span className="text-primary">•</span>
                <span>Succeed</span>
                <span className="text-primary hidden md:inline">•</span>
                <span className="text-primary hidden md:inline">•</span>
            </motion.h1>
        </motion.div>
    </GridBackground>
);

const StudentJourneySection = () => (
    <section id="student-journey" className="py-24 px-4">
        <GridBackground>
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    variants={FADE_IN_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
                        🌱
                        <span>The Student Journey</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        End-to-End Pathway to Get Hired
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        A transparent meritocracy where every step is measurable, performance-based, and tailored to ensure that effort translates into real career outcomes.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={STAGGER_CONTAINER}
                    className="grid lg:grid-cols-3 gap-8"
                >
                    {studentJourneyData.map((level, index) => (
                        <motion.div key={level.level} variants={FADE_IN_UP} className="group relative">
                            <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30">
                                <div className="absolute -top-4 left-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl px-6 py-3 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <level.icon className="size-5" />
                                        <span className="font-bold text-lg">Level {level.level}</span>
                                    </div>
                                </div>
                                <div className="pt-12">
                                    <h3 className="text-2xl font-bold font-heading text-foreground mb-4 leading-tight">
                                        {level.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-6 leading-relaxed">
                                        {level.description}
                                    </p>
                                    <div className="space-y-3">
                                        {level.points.map((point, pIndex) => (
                                            <div key={pIndex} className="flex items-start gap-3 text-left">
                                                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-sm text-muted-foreground">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {index < studentJourneyData.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-border to-transparent"></div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </GridBackground>
    </section>
);

const StudentFeaturesSection = () => (
    <section className="py-24 px-4">
        <GridBackground>
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    variants={FADE_IN_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
                        <Zap className="size-4" />
                        <span>Student Platform Features</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
                        AI-Powered Career Acceleration
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Our comprehensive platform provides students with intelligent tools and personalized guidance to accelerate their career journey from learning to earning.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={STAGGER_CONTAINER}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {studentFeaturesData.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={FADE_IN_UP}
                            className="bg-card/50 border border-border/50 rounded-2xl p-8 text-left hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="p-3 bg-primary/10 rounded-lg mb-6 w-fit">
                                <feature.icon className="size-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold font-heading text-foreground mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </GridBackground>
    </section>
);

const EnterpriseJourneySection = () => (
    <section id="enterprise-journey" className="py-24 px-4">
        <GridBackground>
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    variants={FADE_IN_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
                        🏢
                        <span>The Enterprise Journey</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
                        From a Single Gig to Your Next Great Hire
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Access a curated pipeline of motivated, verified, and proven student talent. Start with low-risk freelance gigs and seamlessly transition to full-time hires.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={STAGGER_CONTAINER}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {enterpriseJourneyData.map((step) => (
                        <motion.div key={step.title} variants={FADE_IN_UP} className="bg-background border border-border/50 rounded-2xl p-8 flex flex-col items-start text-left hover:border-primary/30 hover:-translate-y-1 transition-all">
                            <div className="p-3 bg-primary/10 rounded-lg mb-4">
                                <step.icon className="size-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold font-heading text-foreground mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    variants={FADE_IN_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mt-16 text-center"
                >
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
                        <h3 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-4">
                            The Long-Term Advantage: Talent Pipeline
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
                            This is Aureeture's true differentiator. You come for a gig. You stay for the talent. Build sustainable, de-risked hiring pipelines that reduce recruitment costs and ensure cultural fit.
                        </p>
                        <div className="inline-flex items-center gap-2 text-primary font-medium">
                            <Users className="size-5" />
                            <span>Start building your talent network today</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </GridBackground>
    </section>
);

const EcosystemEngineSection = () => (
    <section className="py-24 px-4">
        <GridBackground>
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    variants={FADE_IN_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-16"
                >
                     <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
                        🔑
                        <span>The Ecosystem Engine</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-4">
                        Dual-Purpose AI Platform
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Our intelligent ecosystem serves both students and enterprises with tailored AI-driven features that create seamless experiences for all stakeholders.
                    </p>
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={STAGGER_CONTAINER}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {ecosystemFeaturesData.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={FADE_IN_UP}
                            className="bg-card/50 border border-border rounded-2xl p-8 text-center hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                                <feature.icon className="size-8 text-primary" />
                            </div>
                         <h3 className="text-xl font-bold font-heading text-foreground mb-4">{feature.title}</h3>
                            <div className="text-left space-y-3">
                               <p><strong className='font-semibold text-foreground'>For Students:</strong> <span className='text-muted-foreground'>{feature.forStudents}</span></p>
                               <p><strong className='font-semibold text-foreground'>For Enterprises:</strong> <span className='text-muted-foreground'>{feature.forEnterprises}</span></p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </GridBackground>
    </section>
);

const FinalCTASection = () => (
    <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-slate-900">
            <Image src="/tempImageC8u1Nc 1.png" alt="Abstract network pattern" fill className="object-cover opacity-10" />
        </div>
        <div className="container mx-auto max-w-4xl text-center">
            <motion.div
                variants={FADE_IN_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <h2 className="text-4xl md:text-6xl font-bold font-heading bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-6">
                    We Are Not Just a Marketplace
                </h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
                    We are an ecosystem where students grow, prove, and launch their careers, while enterprises gain verified, reliable, and future-ready talent.
                </p>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-12">
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">For Students</h3>
                            <p className="text-slate-300">A structured path from zero experience to being a top-tier, employable professional with verified skills and proven track record.</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">For Enterprises</h3>
                            <p className="text-slate-300">A curated, de-risked pipeline to the top 5% of student talent, reducing recruitment costs and ensuring quality hires.</p>
                        </div>
                    </div>
                </div>
                <Link href="#" className="inline-block">
                    <Button size="lg" className="group relative overflow-hidden rounded-full bg-primary px-12 py-8 text-xl font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30">
                        <span className="flex items-center justify-center">
                            <span className="absolute top-0 left-0 h-full w-full bg-white/20 opacity-50 animate-subtle-shine group-hover:opacity-100"></span>
                            Join the Ecosystem
                            <ArrowRight className="ml-3 size-6 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </span>
                    </Button>
                </Link>
            </motion.div>
        </div>
    </section>
);

//================================================================//
//  FINAL PAGE ASSEMBLY
//================================================================//
export default function AureeturePlatformPage() {
    return (
        <main className="min-h-screen bg-background text-foreground antialiased">
            <HeroSection />
            <StudentJourneySection />
            <StudentFeaturesSection />
            <EnterpriseJourneySection />
            <EcosystemEngineSection />
            <FinalCTASection />
        </main>
    );
}
