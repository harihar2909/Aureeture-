"use client";

import React, { useState, FC, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Briefcase, Target, Building, Edit, Mail, Phone, MapPin, Linkedin, 
    BarChart3, CheckCircle, Clock, GraduationCap, Palette, Code, Plus, Trash2, 
    Save, Calendar as CalendarIcon, X, Loader2, Sparkles
} from 'lucide-react';

// --- UI Components (from shadcn/ui or similar) ---
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// --- TYPESCRIPT TYPES ---
type PersonalInfoKey = 'name' | 'email' | 'phone' | 'location' | 'linkedin';
type ProfileData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
};
type TimelineItem = {
  id: number;
  type: 'education' | 'work' | 'project';
  title: string;
  subtitle: string;
  description: string;
};
type Skill = {
  id: number;
  name: string;
};
type Task = {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: Date;
};
type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  match: number;
};
type ModalType = 'ADD_TIMELINE' | 'EDIT_TIMELINE' | 'APPLY_JOB';

// --- HELPER & REUSABLE COMPONENTS ---

const MotionCard = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
  >
    <Card>{children}</Card>
  </motion.div>
);

const EditableField: FC<{
  icon: ReactNode;
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}> = ({ icon, label, value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          {!isEditing ? (
            <p className="font-medium">{value}</p>
          ) : (
            <Input
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="h-8 mt-1"
            />
          )}
        </div>
      </div>
      <div>
        {!isEditing ? (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-1">
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSave}>
               <CheckCircle className="h-4 w-4 text-green-500" />
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(false)}>
               <X className="h-4 w-4 text-red-500" />
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Toast: FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 py-2 px-4 rounded-full bg-foreground text-background shadow-lg z-50"
        >
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="font-medium">{message}</p>
        </motion.div>
    );
};

// Simple Bar Chart for Analytics
const EngagementChart: FC<{ data: { name: string, value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="h-40 flex justify-around items-end gap-2 p-4 bg-muted/50 rounded-lg">
            {data.map((item, index) => (
                <motion.div 
                    key={index} 
                    className="w-full flex flex-col items-center gap-1"
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.value / maxValue) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                    <div className="w-full bg-primary/20 rounded-t-sm flex-grow" />
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                </motion.div>
            ))}
        </div>
    );
};

// Simulate an API call
const simulateApiCall = (duration = 1000) => new Promise(resolve => setTimeout(resolve, duration));

// --- MAIN PROFILE PAGE COMPONENT ---
const ProfilePageDashboard: FC = () => {

  // --- STATE MANAGEMENT ---
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Rishabh Sharma',
    email: 'rishabh.sharma@aureeture.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    linkedin: 'linkedin.com/in/rishabh-sharma',
  });
  
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    { id: 1, type: 'education', title: 'IIT Data Science', subtitle: '2021 - 2025', description: 'GPA: 8.7/10' },
    { id: 2, type: 'work', title: 'Animator', subtitle: 'Disney', description: 'Jul 2025 - Present' },
    { id: 3, type: 'project', title: '3D Animation Portfolio', subtitle: 'Personal Project', description: 'Character animation & VFX' }
  ]);
  
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: '3D Animation' }, { id: 2, name: 'Maya' }, { id: 3, name: 'Blender' },
    { id: 4, name: 'After Effects' }, { id: 5, name: 'Storytelling' }
  ]);
  const [newSkill, setNewSkill] = useState('');

  const [tasks, setTasks] = useState<{ todo: Task[], later: Task[], done: Task[] }>({
    todo: [{ id: 1, title: 'Complete animation reel', priority: 'high', deadline: new Date() }],
    later: [{ id: 2, title: 'Learn Houdini basics', priority: 'low' }],
    done: [{ id: 3, title: 'Finish modeling course', priority: 'high' }]
  });
  
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState<{ title: string; priority: 'high' | 'medium' | 'low', list: 'todo' | 'later', deadline?: Date }>({
    title: '', priority: 'medium', list: 'todo'
  });
  const [modal, setModal] = useState<{ type: ModalType | null; data?: any }>({ type: null });
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- MOCK DATA ---
  const snapshotData = {
    careerStage: 'Professional',
    longTermGoal: 'Become a lead animator',
    currentRole: 'Animator',
    company: 'Disney',
    joinDate: 'Jul 2025'
  };

  const analytics = {
    profileCompletion: 85,
    skillScore: 847,
    connections: 89,
    applications: 12,
    jobMatches: 24,
    chartData: [
        { name: 'Views', value: 127 },
        { name: 'Connects', value: 89 },
        { name: 'Applies', value: 12 },
        { name: 'Matches', value: 24 },
    ]
  };

  const careerGoals = [
    { name: 'Portfolio', progress: 75 },
    { name: 'Networking', progress: 60 },
    { name: 'Skills', progress: 90 },
    { name: 'Experience', progress: 45 },
  ];

  const jobRecommendations = [
    { id: 1, title: 'Senior 3D Animator', company: 'Pixar', location: 'Emeryville, CA', match: 92 },
    { id: 2, title: 'Character Animator', company: 'DreamWorks', location: 'Glendale, CA', match: 88 },
    { id: 3, title: 'VFX Animator', company: 'Industrial Light & Magic', location: 'San Francisco, CA', match: 85 },
    { id: 4, title: 'Game Animator', company: 'Riot Games', location: 'Los Angeles, CA', match: 82 },
  ];

  // --- HANDLERS ---
  const showToast = (message: string) => setToast({ id: Date.now(), message });

  const handleSaveAll = async () => {
    setIsSaving(true);
    await simulateApiCall();
    setIsSaving(false);
    showToast("Profile saved successfully!");
  };

  const handleProfileDataSave = (key: PersonalInfoKey, value: string) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills(prev => [...prev, { id: Date.now(), name: newSkill.trim() }]);
      setNewSkill('');
    }
  };
  const handleDeleteSkill = (id: number) => setSkills(prev => prev.filter(s => s.id !== id));

  const handleOpenTaskModal = (list: 'todo' | 'later') => {
      setNewTaskData(prev => ({ ...prev, list, title: '', priority: 'medium', deadline: undefined }));
      setTaskModalOpen(true);
  }

  const handleAddTask = () => {
    if(!newTaskData.title.trim()) return;
    const newTask: Task = {
        id: Date.now(),
        title: newTaskData.title,
        priority: newTaskData.priority,
        deadline: newTaskData.deadline,
    };
    setTasks(prev => ({ ...prev, [newTaskData.list]: [newTask, ...prev[newTaskData.list]] }));
    setTaskModalOpen(false);
  };

  const getPriorityClasses = (p: Task['priority']) => ({
      high: 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400',
      medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
      low: 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
  }[p]);

  const getTimelineIcon = (type: TimelineItem['type']) => {
      if(type === 'education') return <GraduationCap className="h-5 w-5"/>
      if(type === 'work') return <Briefcase className="h-5 w-5"/>
      return <Palette className="h-5 w-5"/>
  }

  return (
    <div className="bg-muted/40 min-h-screen p-4 sm:p-6 lg:p-8">
      <AnimatePresence>
        {toast && <Toast key={toast.id} message={toast.message} onDismiss={() => setToast(null)} />}
      </AnimatePresence>
      
      {/* --- ADD TASK MODAL --- */}
      <Dialog open={isTaskModalOpen} onOpenChange={setTaskModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Task</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <Input 
                placeholder="Task title..."
                value={newTaskData.title}
                onChange={(e) => setNewTaskData(p => ({...p, title: e.target.value}))}
            />
            <Select value={newTaskData.priority} onValueChange={(v: Task['priority']) => setNewTaskData(p => ({...p, priority: v}))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn(!newTaskData.deadline && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTaskData.deadline ? format(newTaskData.deadline, "PPP") : <span>Pick a deadline</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newTaskData.deadline} onSelect={(d) => setNewTaskData(p => ({...p, deadline: d}))} initialFocus /></PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleAddTask}>Add Task</Button>
        </DialogContent>
      </Dialog>
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- HERO SECTION --- */}
        <section>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold tracking-tight mb-4">Hey Rishabh 👋 Welcome back!</h1>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MotionCard delay={1}>
              <CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Career Stage</CardTitle><Briefcase className="h-4 w-4 text-muted-foreground"/></CardHeader>
              <CardContent><div className="text-2xl font-bold">{snapshotData.careerStage}</div></CardContent>
            </MotionCard>
            <MotionCard delay={2}>
              <CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Long-term Goal</CardTitle><Target className="h-4 w-4 text-muted-foreground"/></CardHeader>
              <CardContent><div className="text-2xl font-bold">{snapshotData.longTermGoal}</div></CardContent>
            </MotionCard>
            <MotionCard delay={3}>
              <CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Current Role</CardTitle><Building className="h-4 w-4 text-muted-foreground"/></CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{snapshotData.currentRole} at {snapshotData.company}</div>
                  <p className="text-xs text-muted-foreground">Since {snapshotData.joinDate}</p>
              </CardContent>
            </MotionCard>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* --- PERSONAL INFO --- */}
            <MotionCard delay={4}>
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField icon={<User size={16}/>} label="Full Name" value={profileData.name} onSave={(v) => handleProfileDataSave('name', v)} />
                <EditableField icon={<Mail size={16}/>} label="Email" value={profileData.email} onSave={(v) => handleProfileDataSave('email', v)} />
                <EditableField icon={<Phone size={16}/>} label="Phone" value={profileData.phone} onSave={(v) => handleProfileDataSave('phone', v)} />
                <EditableField icon={<MapPin size={16}/>} label="Location" value={profileData.location} onSave={(v) => handleProfileDataSave('location', v)} />
                <div className="md:col-span-2">
                    <EditableField icon={<Linkedin size={16}/>} label="LinkedIn" value={profileData.linkedin} onSave={(v) => handleProfileDataSave('linkedin', v)} />
                </div>
              </CardContent>
            </MotionCard>

            {/* --- CAREER TIMELINE --- */}
            <MotionCard delay={5}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Career Timeline</CardTitle>
                        <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2"/>Add Project</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6">
                        <div className="absolute left-[34px] top-4 h-[calc(100%-2rem)] w-0.5 bg-border -translate-x-1/2"></div>
                        {timelineItems.map((item) => (
                          <div key={item.id} className="flex items-start gap-4 mb-6 last:mb-0">
                             <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 z-10">{getTimelineIcon(item.type)}</div>
                             <div>
                                 <h3 className="font-semibold">{item.title} - <span className="text-muted-foreground font-normal">{item.subtitle}</span></h3>
                                 <p className="text-sm text-muted-foreground">{item.description}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                </CardContent>
            </MotionCard>
            
            {/* --- TASK MANAGER --- */}
            <MotionCard delay={6}>
                <CardHeader><CardTitle>Task Manager</CardTitle></CardHeader>
                <CardContent>
                    <Tabs defaultValue="todo">
                        <div className="flex justify-between items-center mb-4">
                           <TabsList>
                               <TabsTrigger value="todo">To-Do ({tasks.todo.length})</TabsTrigger>
                               <TabsTrigger value="later">Later ({tasks.later.length})</TabsTrigger>
                               <TabsTrigger value="done">Done ({tasks.done.length})</TabsTrigger>
                           </TabsList>
                           <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleOpenTaskModal('todo')}><Plus className="h-4 w-4 mr-2"/>To-Do</Button>
                              <Button variant="outline" size="sm" onClick={() => handleOpenTaskModal('later')}><Plus className="h-4 w-4 mr-2"/>Later</Button>
                           </div>
                        </div>
                        <TabsContent value="todo" className="space-y-2">
                          {tasks.todo.map(t => <div key={t.id} className="p-3 bg-muted/50 rounded-lg flex justify-between items-center"><p>{t.title}</p><Badge variant="outline" className={getPriorityClasses(t.priority)}>{t.priority}</Badge></div>)}
                        </TabsContent>
                        <TabsContent value="later" className="space-y-2">
                          {tasks.later.map(t => <div key={t.id} className="p-3 bg-muted/50 rounded-lg flex justify-between items-center"><p>{t.title}</p><Badge variant="outline" className={getPriorityClasses(t.priority)}>{t.priority}</Badge></div>)}
                        </TabsContent>
                        <TabsContent value="done" className="space-y-2">
                          {tasks.done.map(t => <div key={t.id} className="p-3 bg-muted/50 rounded-lg flex items-center gap-2 text-muted-foreground line-through"><CheckCircle className="h-4 w-4 text-green-500"/>{t.title}</div>)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </MotionCard>

          </div>
          <div className="space-y-8">
              {/* --- CAREER SNAPSHOT --- */}
              <MotionCard delay={7}>
                  <CardHeader><CardTitle>Career Snapshot</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                          <div className="flex justify-between mb-1"><p className="text-sm font-medium">Profile Completion</p><p className="text-sm font-medium">{analytics.profileCompletion}%</p></div>
                          <Progress value={analytics.profileCompletion}/>
                      </div>
                      <div className="p-4 text-center bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Skill Score</p>
                          <p className="text-4xl font-bold">{analytics.skillScore}</p>
                          <Badge>Above Average</Badge>
                      </div>
                      <EngagementChart data={analytics.chartData}/>
                  </CardContent>
              </MotionCard>
              
              {/* --- SKILLS --- */}
              <MotionCard delay={8}>
                  <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                  <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                          {skills.map(skill => (
                              <Badge key={skill.id} variant="secondary" className="group pr-1">
                                  {skill.name}
                                  <button onClick={() => handleDeleteSkill(skill.id)} className="ml-1 opacity-0 group-hover:opacity-100"><X className="h-3 w-3"/></button>
                              </Badge>
                          ))}
                      </div>
                      <div className="flex gap-2">
                         <Input placeholder="Add a new skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSkill()}/>
                         <Button onClick={handleAddSkill} size="sm">Add</Button>
                      </div>
                  </CardContent>
              </MotionCard>

              {/* --- CAREER GOALS --- */}
              <MotionCard delay={9}>
                  <CardHeader><CardTitle>Career Goals Tracker</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      {careerGoals.map(goal => (
                          <div key={goal.name}>
                             <div className="flex justify-between mb-1"><p className="text-sm font-medium">{goal.name}</p><p className="text-sm font-medium">{goal.progress}%</p></div>
                             <Progress value={goal.progress}/>
                          </div>
                      ))}
                  </CardContent>
              </MotionCard>
          </div>
        </div>

        {/* --- JOB RECOMMENDATIONS --- */}
        <section className="mt-8">
            <MotionCard delay={10}>
                <CardHeader><CardTitle>Job Recommendations For You</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4 -mx-2 px-2 snap-x snap-mandatory">
                        {jobRecommendations.map(job => (
                            <Card key={job.id} className="min-w-[280px] snap-start flex-shrink-0">
                                <CardHeader>
                                    <CardTitle className="text-lg">{job.title}</CardTitle>
                                    <CardDescription>{job.company} - {job.location}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Match Score</p>
                                        <p className="text-xl font-bold text-primary">{job.match}%</p>
                                    </div>
                                    <Button size="sm">Apply Now</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </MotionCard>
        </section>
        
        {/* --- REVIEW & SAVE --- */}
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="mt-8 p-6 bg-card rounded-lg flex flex-col md:flex-row items-center justify-between gap-4"
        >
            <div>
                <h3 className="text-xl font-bold">Review Your Profile</h3>
                <p className="text-muted-foreground">Ensure all your information is up-to-date to get the best opportunities.</p>
            </div>
            <Button onClick={handleSaveAll} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Save className="h-4 w-4 mr-2"/>}
                {isSaving ? "Saving..." : "Save & Proceed"}
            </Button>
        </motion.section>
      </div>
    </div>
  );
};

export default ProfilePageDashboard;