"use client";

import React, { FC, ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Removed CardDescription as it's not used in the final version
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    MessageCircle,
    Bot,
    Code,
    BarChart3,
    Palette,
    Briefcase,
    Settings,
    Zap,
    Users,
    Target,
    Sparkles,
    Play,
    Mic,
    Send,
    CheckCircle,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

// --- WIDGET WRAPPER COMPONENT (Updated for better theme support) ---
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

// --- MAIN CARO PAGE COMPONENT ---
const CaroPage: React.FC = () => {
    const [selectedStream, setSelectedStream] = useState('software-development');
    const [chatMode, setChatMode] = useState<'text' | 'voice'>('text');
    const [demoMessage, setDemoMessage] = useState('');
    const [demoMessages, setDemoMessages] = useState([
        { sender: 'user' as const, message: 'How do I optimize this React component?' },
        { sender: 'caro' as const, message: 'I can help! Use React.memo for preventing unnecessary re-renders, useCallback for event handlers, and consider code splitting. Would you like a code example?' }
    ]);

    const streams = [
        {
            id: 'software-development',
            name: 'Software',
            icon: Code,
            description: 'Debug code, learn frameworks, and build projects with guided AI support.',
            features: ['Code Review', 'Framework Guidance', 'Debugging Help', 'Architecture Design'],
            prompts: [
                'Debug this React component performance issue',
                'Explain microservices architecture patterns',
                'Review my API design for best practices',
            ]
        },
        {
            id: 'data-science',
            name: 'Data Science',
            icon: BarChart3,
            description: 'Get help with Python, ML models, data visualization, and project workflows.',
            features: ['ML Model Building', 'Data Analysis', 'Python Support', 'Visualization'],
            prompts: [
                'Help me optimize this ML model accuracy',
                'Create a data visualization for trends',
                'Explain feature engineering techniques',
            ]
        },
        {
            id: 'design',
            name: 'Design',
            icon: Palette,
            description: 'UI/UX guidance, design principles, and creative problem-solving assistance.',
            features: ['UI/UX Design', 'Design Systems', 'Prototyping', 'User Research'],
            prompts: [
                'Review my user interface design',
                'Suggest improvements for user experience',
                'Help with design system consistency',
            ]
        },
        {
            id: 'business',
            name: 'Business',
            icon: Briefcase,
            description: 'Strategic thinking, business analysis, and consulting methodologies.',
            features: ['Strategy Planning', 'Market Analysis', 'Case Studies', 'Frameworks'],
            prompts: [
                'Analyze this market opportunity',
                'Help structure a consulting framework',
                'Review my business strategy approach',
            ]
        }
    ];

    const keyFeatures = [
        { icon: Target, title: 'Personalized by Stream', description: 'Copilots trained for Software, Data Science, Design, and more.' },
        { icon: MessageCircle, title: 'Dual Interaction Modes', description: 'Chat via text OR voice — just like GPT with seamless switching.' },
        { icon: Zap, title: 'Real-Time Assistance', description: 'Instant solutions, explanations, and learning support across domains.' },
        { icon: Settings, title: 'Integrated Dashboard', description: 'Caro works inside your dashboard for seamless career & skill building.' }
    ];

    const handleSendDemo = () => {
        if (!demoMessage.trim()) return;

        const newUserMessage = { sender: 'user' as const, message: demoMessage };
        setDemoMessages(prev => [...prev, newUserMessage]);
        setDemoMessage('');

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "That's a great question! Let me break this down for you...",
                "I can definitely help with that. Here's what I recommend...",
                "Excellent! This is a common challenge. Let me guide you..."
            ];
            const aiMessage = { sender: 'caro' as const, message: responses[Math.floor(Math.random() * responses.length)] };
            setDemoMessages(prev => [...prev, aiMessage]);
        }, 1000);
    };

    const selectedStreamData = streams.find(s => s.id === selectedStream);

    return (
        <TooltipProvider>
            <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-6 lg:p-8 relative overflow-hidden">
                {/* --- AURORA BACKGROUND (Updated Opacity) --- */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute w-[500px] h-[500px] bg-purple-500/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-aurora-1"></div>
                    <div className="absolute w-[400px] h-[400px] bg-blue-500/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-aurora-2"></div>
                </div>

                {/* --- BACKGROUND NOISE TEXTURE --- */}
                <div className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20800%20800%22%3E%3Cdefs%3E%3Cfilter%20id%3D%22a%22%20x%3D%22-50%25%22%20y%3D%22-50%25%22%20width%3D%22200%25%22%20height%3D%22200%25%22%20color-interpolation-filters%3D%22sRGB%22%3E%3CfeTurbulence%20baseFrequency%3D%22.7%22%20seed%3D%221%22%20stitchTiles%3D%22stitch%22/%3E%3CfeColorMatrix%20values%3D%220%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20.07%200%22/%3E%3C/filter%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23a)%22/%3E%3C/svg%3E')] opacity-20 -z-10"></div>

                <main className="max-w-7xl mx-auto">
                    {/* --- HEADER --- */}
                    <motion.header
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex items-center space-x-4 mb-8"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center">
                            <Bot className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Caro – Your Personalized AI Copilot</h1>
                            <p className="text-muted-foreground">Stream-specific copilots with Chat + Voice support to accelerate your growth.</p>
                        </div>
                    </motion.header>

                    {/* --- BENTO GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Widget className="lg:col-span-2 p-6">
                            <CardTitle className="flex items-center gap-2 mb-4"><Sparkles size={20}/>Meet Your Intelligent Copilot</CardTitle>
                            <p className="text-muted-foreground mb-4">
                                Caro is an intelligent copilot, personalized for your career or learning stream. Whether you're coding, analyzing data, or exploring new fields, Caro adapts to your needs with tailored guidance.
                            </p>
                            <div className="flex gap-2">
                                <Badge variant="secondary">AI-Powered</Badge>
                                <Badge variant="secondary">Personalized</Badge>
                                <Badge variant="secondary">24/7 Available</Badge>
                            </div>
                        </Widget>

                        <Widget className="lg:col-span-2 p-6 space-y-4">
                            <CardTitle className="flex items-center gap-2 mb-2">Key Features</CardTitle>
                            <div className="grid grid-cols-2 gap-4">
                                {keyFeatures.map(feature => (
                                    <div key={feature.title} className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0 mt-1">
                                            <feature.icon size={16}/>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{feature.title}</p>
                                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Widget>

                        <Widget className="lg:col-span-4 p-6">
                            <CardTitle className="flex items-center gap-2 mb-4">Choose Your Stream</CardTitle>
                            <Tabs value={selectedStream} onValueChange={setSelectedStream} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                                    {streams.map(stream => {
                                        const StreamIcon = stream.icon;
                                        return (
                                            <TabsTrigger key={stream.id} value={stream.id}>
                                                <StreamIcon className="w-4 h-4 mr-2"/>
                                                {stream.name}
                                            </TabsTrigger>
                                        );
                                    })}
                                </TabsList>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedStream}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="mt-4 p-6 bg-background/50 dark:bg-black/20 rounded-lg">
                                            <div className="grid md:grid-cols-2 gap-6 items-center">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-2">{selectedStreamData?.name} Copilot</h3>
                                                    <p className="text-muted-foreground mb-4 text-sm">{selectedStreamData?.description}</p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {selectedStreamData?.features.map(f => <div key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500"/>{f}</div>)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2 text-sm">Sample Prompts:</h4>
                                                    <div className="space-y-2 text-sm text-muted-foreground">
                                                        {selectedStreamData?.prompts.map(p => <p key={p}>• "{p}"</p>)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </Tabs>
                        </Widget>

                        <Widget className="lg:col-span-3">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">Live Demo</CardTitle>
                                    <div className="flex gap-2">
                                        <Button variant={chatMode === 'text' ? 'secondary' : 'ghost'} size="sm" onClick={() => setChatMode('text')}><MessageCircle className="w-4 h-4 mr-2"/>Text</Button>
                                        <Button variant={chatMode === 'voice' ? 'secondary' : 'ghost'} size="sm" onClick={() => setChatMode('voice')}><Mic className="w-4 h-4 mr-2"/>Voice</Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col h-[400px] p-0">
                                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/30 dark:bg-black/10">
                                    {demoMessages.map((msg, index) => (
                                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.sender === 'caro' && <Avatar className="h-8 w-8"><AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=caro" /></Avatar>}
                                            <div className={`max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card/80 dark:bg-neutral-800 rounded-bl-none'}`}>
                                                <p className="text-sm">{msg.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-border/20">
                                    {chatMode === 'text' ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={demoMessage}
                                                onChange={(e) => setDemoMessage(e.target.value)}
                                                placeholder="Ask Caro anything..."
                                                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendDemo()}
                                            />
                                            <Button onClick={handleSendDemo} size="icon" className="rounded-full flex-shrink-0"><Send className="w-4 h-4" /></Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-4">
                                            <Button size="icon" className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600">
                                                <Mic className="w-6 h-6" />
                                            </Button>
                                            <p className="text-sm text-muted-foreground">Voice mode simulation</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Widget>

                        {/* --- "Why Choose Caro?" Widget (SVG removed) --- */}
                        <Widget className="p-6 relative overflow-hidden">
                            {/* The SVG code for the spider trap graphic was here and has been removed. */}
                            <div className="relative z-10">
                                <CardTitle className="flex items-center gap-2 mb-4">Why Choose Caro?</CardTitle>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-sm flex items-center gap-2 mb-1"><Users size={16} className="text-primary"/>For Learners</h3>
                                        <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                                            <li>Skill building guidance</li>
                                            <li>Personalized learning paths</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm flex items-center gap-2 mb-1"><Briefcase size={16} className="text-primary"/>For Professionals</h3>
                                        <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                                            <li>Faster problem-solving</li>
                                            <li>Code optimization</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm flex items-center gap-2 mb-1"><Target size={16} className="text-primary"/>For Teams</h3>
                                        <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                                            <li>Collaborative AI insights</li>
                                            <li>Project guidance</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Widget>

                        <Widget className="lg:col-span-4 p-8 text-center bg-gradient-to-r from-primary to-primary/70 text-primary-foreground">
                            <h2 className="text-3xl font-bold mb-2">Ready to Meet Your AI Copilot?</h2>
                            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                                Start your journey with AI-powered guidance tailored to your field.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button variant="secondary" size="lg"><Play className="w-5 h-5 mr-2" />Launch Caro Copilot</Button>
                                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/50 hover:bg-primary-foreground/10">Book a Walkthrough</Button>
                            </div>
                        </Widget>
                    </div>
                </main>
            </div>
        </TooltipProvider>
    );
};

export default CaroPage;