"use client";

import React, { FC, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, UserPlus, Search, MapPin, Briefcase, Network, PlusCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

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

// --- TYPESCRIPT TYPE & MOCK DATA ---
type Person = {
    id: number;
    name: string;
    role: string;
    company: string;
    location: string;
    avatar: string;
    mutualConnections: number;
    skills: string[];
};

const allConnections: Person[] = [
    { id: 1, name: "Priya Sharma", role: "Senior Product Manager", company: "Flipkart", location: "Bangalore", avatar: "PS", mutualConnections: 12, skills: ["Product Strategy", "Analytics", "Roadmapping"] },
    { id: 2, name: "Rahul Gupta", role: "Software Engineer", company: "Google", location: "Hyderabad", avatar: "RG", mutualConnections: 8, skills: ["React", "Node.js", "TypeScript"] },
    { id: 3, name: "Anita Patel", role: "UX Designer", company: "Zomato", location: "Mumbai", avatar: "AP", mutualConnections: 15, skills: ["UI/UX", "Figma", "User Research"] },
    { id: 4, name: "Vikram Singh", role: "Data Scientist", company: "Paytm", location: "Delhi", avatar: "VS", mutualConnections: 6, skills: ["Python", "ML", "TensorFlow"] }
];

// --- NEW MODAL COMPONENT ---
const ConnectModal: FC<{ person: Person | null; onClose: () => void; }> = ({ person, onClose }) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        // Reset message when a new person is selected
        if (person) {
            setMessage(`Hi ${person.name.split(' ')[0]}, I'd like to connect with you.`);
        }
    }, [person]);

    if (!person) return null;

    const handleSendInvitation = () => {
        setIsSending(true);
        console.log(`Sending invitation to ${person.name} with message: "${message}"`);
        // Simulate API call
        setTimeout(() => {
            alert(`Connection request sent to ${person.name}!`);
            setIsSending(false);
            onClose();
        }, 1500);
    };
    
    return (
        <Dialog open={!!person} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send a connection request</DialogTitle>
                    <DialogDescription>Personalize your invitation to {person.name}.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        placeholder="Add a personal note..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                    />
                     <p className="text-xs text-muted-foreground mt-2 text-right">{300 - message.length} characters remaining</p>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={isSending}>Cancel</Button>
                    <Button onClick={handleSendInvitation} disabled={isSending}>
                        {isSending ? "Sending..." : "Send Invitation"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// --- PERSON CARD SUB-COMPONENT ---
const PersonCard: FC<{ person: Person; index: number; onConnect: (person: Person) => void }> = ({ person, index, onConnect }) => (
    <motion.div
        layout
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-background/50 dark:bg-black/20 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
    >
        <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">{person.avatar}</AvatarFallback>
            </Avatar>
            <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold">{person.name}</h4>
                    <Badge variant="secondary">{person.mutualConnections} mutual</Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"><Briefcase className="w-3.5 h-3.5" /> {person.role} at {person.company}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"><MapPin className="w-3.5 h-3.5" /> {person.location}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {person.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="font-normal">{skill}</Badge>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0 self-end sm:self-center">
            <Tooltip><TooltipTrigger asChild><Button size="icon" variant="outline" className="rounded-full"><MessageCircle className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Send Message</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button size="icon" className="rounded-full" onClick={() => onConnect(person)}><UserPlus className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Connect</p></TooltipContent></Tooltip>
        </div>
    </motion.div>
);

// --- MAIN PAGE COMPONENT ---
const PeopleFinderPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredConnections, setFilteredConnections] = useState(allConnections);
    const [personToConnect, setPersonToConnect] = useState<Person | null>(null);

    // Effect for live search filtering
    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        if (lowercasedQuery === '') {
            setFilteredConnections(allConnections);
        } else {
            const filtered = allConnections.filter(person =>
                person.name.toLowerCase().includes(lowercasedQuery) ||
                person.role.toLowerCase().includes(lowercasedQuery) ||
                person.company.toLowerCase().includes(lowercasedQuery) ||
                person.location.toLowerCase().includes(lowercasedQuery) ||
                person.skills.some(skill => skill.toLowerCase().includes(lowercasedQuery))
            );
            setFilteredConnections(filtered);
        }
    }, [searchQuery]);

    const stats = [
        { label: 'Total Connections', value: '127', color: 'text-blue-500' },
        { label: 'New This Week', value: '23', color: 'text-green-500' },
        { label: 'Response Rate', value: '89%', color: 'text-purple-500' }
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
                    <motion.header initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex items-center space-x-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center">
                            <Users className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">People Finder</h1>
                            <p className="text-muted-foreground">Discover and connect with professionals in your field.</p>
                        </div>
                    </motion.header>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <Widget className="lg:col-span-4 p-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                                <div className="lg:col-span-2">
                                    <h3 className="font-semibold mb-2">Find Your Next Connection</h3>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by name, role, company, or skills..."
                                            className="pl-12 h-12 rounded-full bg-background/50 dark:bg-black/20"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    {stats.map(stat => (<div key={stat.label}><p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>))}
                                </div>
                            </div>
                        </Widget>

                        <Widget className="lg:col-span-4 p-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Network size={22} />Suggested Connections</h2>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {filteredConnections.length > 0 ? (
                                        filteredConnections.map((person, index) => (
                                            <PersonCard key={person.id} person={person} index={index} onConnect={setPersonToConnect} />
                                        ))
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">No connections found matching your search.</p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Widget>
                        
                        {/* CTA Widget (No changes) */}
                    </div>
                </main>
                <ConnectModal person={personToConnect} onClose={() => setPersonToConnect(null)} />
            </div>
        </TooltipProvider>
    );
};

export default PeopleFinderPage;