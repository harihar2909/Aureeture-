"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  Rocket,
  Map,
  Briefcase,
  Settings,
  Bell,
  User,
  Bot,
  Menu,
  X,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Overview,
  PeopleFinder,
  PathFinder,
  RealTimeProjects,
  PersonalisedRoadmap,
  JobFinder,
  Profile,
  Caro,
} from "@/components/dashboard/modules";
import ThemeToggle from "../../components/dashboard/ThemeToggle";
import ProfileSettings from "../../components/dashboard/ProfileSettings";
import { ProfileProvider, useProfile } from "@/contexts/ProfileContext";
import { useUser, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { PathProvider } from "@/contexts/PathContext";
import { clsx } from "clsx";

// --- TYPES & CONSTANTS ---
// For better type-safety and to keep static data outside the component render cycle.

interface Module {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
  component: React.ComponentType;
}

const DASHBOARD_MODULES: Module[] = [
  {
    id: "profile",
    name: "Profile",
    icon: User,
    description: "Your career dashboard & progress",
    color: "from-indigo-500 to-indigo-600",
    component: Profile,
  },
  {
    id: "caro",
    name: "Caro AI Copilot",
    icon: Bot,
    description: "Your personalized AI assistant",
    color: "from-cyan-500 to-blue-600",
    component: Caro,
  },
  {
    id: "overview",
    name: "Pathfinder",
    icon: BarChart3,
    description: "What's Next for You",
    color: "from-blue-500 to-blue-600",
    component: Overview,
  },
  // {
  //   id: "pathfinder",
  //   name: "Path Finder",
  //   icon: Map,
  //   description: "Navigate your career journey",
  //   color: "from-indigo-500 to-indigo-600",
  //   component: PathFinder,
  // },
  {
    id: "people-finder",
    name: "People Finder",
    icon: Users,
    description: "Connect with professionals",
    color: "from-green-500 to-green-600",
    component: PeopleFinder,
  },
  {
    id: "real-time-projects",
    name: "Real-time Projects",
    icon: Rocket,
    description: "Live project opportunities",
    color: "from-purple-500 to-purple-600",
    component: RealTimeProjects,
  },
  {
    id: "personalised-roadmap",
    name: "Personalised Roadmap",
    icon: Map,
    description: "Your learning journey",
    color: "from-orange-500 to-orange-600",
    component: PersonalisedRoadmap,
  },
  {
    id: "job-finder",
    name: "Job Finder",
    icon: Briefcase,
    description: "Career opportunities",
    color: "from-pink-500 to-pink-600",
    component: JobFinder,
  },
];

// --- CUSTOM HOOKS ---
// A simple hook to manage responsiveness.

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

// --- CHILD COMPONENTS ---
// Breaking down the UI into smaller, reusable components.

// ## SidebarItem Component ##
interface SidebarItemProps {
  module: Module;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ module, isActive, isCollapsed, onClick }) => {
  const Icon = module.icon;
  return (
    <motion.button
      onClick={onClick}
      className={clsx(
        "w-full group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
        {
          "justify-center": isCollapsed,
          [`bg-gradient-to-r ${module.color} text-white shadow-lg`]: isActive,
          "hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300": !isActive,
        }
      )}
      title={isCollapsed ? module.name : ""}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && (
        <motion.div
          className="flex-1 text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="font-semibold text-sm">{module.name}</div>
          <div className="text-xs opacity-75">{module.description}</div>
        </motion.div>
      )}
      {isActive && (
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/30 rounded-l-full"
          layoutId="activeIndicator"
        />
      )}
    </motion.button>
  );
};

// ## Sidebar Component ##
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  activeModule: string;
  setActiveModule: (id: string) => void;
  isMobile: boolean;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (value: boolean) => void;
  onProfileSettingsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, activeModule, setActiveModule, isMobile, mobileSidebarOpen, setMobileSidebarOpen, onProfileSettingsClick }) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <motion.div
      className={clsx(
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col shadow-xl z-20",
        {
          "fixed top-0 left-0 h-full w-80": isMobile,
          "relative transition-all duration-300": !isMobile,
          "w-20": !isMobile && isCollapsed,
          "w-80": !isMobile && !isCollapsed,
        }
      )}
      initial={isMobile ? "closed" : false}
      animate={isMobile ? (mobileSidebarOpen ? "open" : "closed") : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
                AureetureAI
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Career Dashboard</p>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (isMobile ? setMobileSidebarOpen(false) : setIsCollapsed(!isCollapsed))}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={isMobile ? "Close menu" : "Toggle sidebar"}
          >
            {isMobile ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Modules */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {DASHBOARD_MODULES.map((module) => (
          <SidebarItem
            key={module.id}
            module={module}
            isActive={activeModule === module.id}
            isCollapsed={isCollapsed}
            onClick={() => {
                setActiveModule(module.id)
                if (isMobile) setMobileSidebarOpen(false)
            }}
          />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <ThemeToggle />
            <Button size="sm" variant="ghost" className="p-2" aria-label="Notifications"><Bell className="w-4 h-4" /></Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="p-2" 
              aria-label="Profile Settings"
              onClick={onProfileSettingsClick}
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button size="sm" variant="outline" className="flex-1 gap-2"><Bell className="w-4 h-4" /> Notifications</Button>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full gap-2"
              onClick={onProfileSettingsClick}
            >
              <User className="w-4 h-4" /> Profile Settings
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};


// ## Header Component ##
interface HeaderProps {
    activeModuleData?: Module;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeModuleData, onMenuClick }) => {
    const { profile } = useProfile();
    return (
      <motion.div
        className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 p-6 shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick} aria-label="Open menu">
                    <Menu />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {activeModuleData?.name || 'Dashboard'}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                        {activeModuleData?.description || 'Welcome to your career dashboard'}
                    </p>
                </div>
            </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <User className="w-4 h-4" />
              <span className="font-medium">{profile.email}</span>
            </div>
            <Card className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Online</span>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    );
}

// ## MainContent Component ##
interface MainContentProps {
    activeModule: string;
}

const MainContent: React.FC<MainContentProps> = ({ activeModule }) => {
    // This lookup is more efficient and scalable than a switch statement.
    const ActiveComponent = useMemo(() =>
        DASHBOARD_MODULES.find(m => m.id === activeModule)?.component || Profile,
        [activeModule]
    );

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
    )
}

// --- MAIN DASHBOARD COMPONENT ---
// The main component now orchestrates the layout and state.

const DashboardContent: React.FC = () => {
  const { profile, updateProfile, setProfile } = useProfile();
  const { user, isSignedIn } = useUser();
  const [activeModule, setActiveModule] = useState<string>("profile");
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState<boolean>(false);
  
  // Responsive state management
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Collapse sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
        setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Fetch profile from backend for the signed-in user
  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
    const fetchProfile = async () => {
      if (!isSignedIn || !user) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/profile?userId=${encodeURIComponent(user.id)}`);
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name,
            email: data.email,
            profilePicture: "",
            bio: data.bio,
            jobTitle: undefined,
            company: undefined,
            education: `${data.education?.degree || ""} ${data.education?.college ? `@ ${data.education.college}` : ""} ${data.education?.graduationYear ? `(${data.education.graduationYear})` : ""}`.trim(),
            location: undefined,
          });
        }
      } catch (e) {
        // ignore and keep defaults
      }
    };
    fetchProfile();
  }, [isSignedIn, user, setProfile]);

  const activeModuleData = DASHBOARD_MODULES.find(m => m.id === activeModule);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <div className="flex h-screen overflow-hidden">
        
        {/* Responsive Sidebar */}
        <Sidebar 
            isCollapsed={sidebarCollapsed}
            setIsCollapsed={setSidebarCollapsed}
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            isMobile={isMobile}
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
            onProfileSettingsClick={() => setIsProfileSettingsOpen(true)}
        />

        {/* Backdrop for mobile sidebar */}
        {isMobile && mobileSidebarOpen && (
            <div 
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-10"
            />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            activeModuleData={activeModuleData}
            onMenuClick={() => setMobileSidebarOpen(true)}
          />
          <MainContent activeModule={activeModule} />
        </div>

        {/* Profile Settings Modal */}
        <ProfileSettings
          isOpen={isProfileSettingsOpen}
          onClose={() => setIsProfileSettingsOpen(false)}
          currentProfile={profile}
          onSave={(updatedProfile) => {
            updateProfile(updatedProfile);
            setIsProfileSettingsOpen(false);
          }}
        />

      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <ProfileProvider>
      <PathProvider>
        <SignedOut>
          <RedirectToSignIn redirectUrl="/dashboard" />
        </SignedOut>
        <DashboardContent />
      </PathProvider>
    </ProfileProvider>
  );
};

export default Dashboard;