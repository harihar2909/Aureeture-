// src/components/dashboard/ResponsiveSidebar.tsx
"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, Menu, Bot, Bell, ChevronsLeft, UserCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useMediaQuery } from '@/hooks/use-mobile'; // Assuming a custom hook
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils'; // Assuming a cn utility

// --- TYPES ---
export interface Module {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ResponsiveSidebarProps {
  modules: Module[];
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
  onLogout: () => void;
  onSettingsClick: () => void;
  onNotificationsClick: () => void;
  userEmail: string;
}

// --- NEW: CONTEXT FOR STATE MANAGEMENT ---
interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// --- MAIN COMPONENT ---
const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = (props) => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  const handleModuleClick = (moduleId: string) => {
    props.onModuleChange(moduleId);
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleLogoClick = () => router.push('/');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setMobileMenuOpen(false);
        mobileToggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);
  
  // REFACTORED: Wrap providers around the content
  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse: () => setIsCollapsed(!isCollapsed) }}>
      <TooltipProvider delayDuration={0}>
        {/* --- MOBILE HEADER & OVERLAY --- */}
        <header className="md:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-lg">
          <button onClick={handleLogoClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label="Go to homepage">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            {/* Consistent branding */}
            <span className="text-lg font-bold">Aureeture</span>
          </button>
          <Button ref={mobileToggleRef} variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu">
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
              <motion.aside initial={{ x: '-100%' }} animate={{ x: '0%' }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r bg-background">
                <SidebarContent {...props} onModuleChange={handleModuleClick} onLogoClick={handleLogoClick} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* --- DESKTOP "FLOATING WIDGET" SIDEBAR --- */}
        <aside
          className={cn(
            "hidden md:flex flex-col fixed left-4 top-4 h-[calc(100vh-2rem)]",
            "bg-card/60 dark:bg-neutral-900/60 backdrop-blur-xl",
            "border border-border/20 dark:border-white/10 rounded-2xl",
            "shadow-lg dark:shadow-2xl dark:shadow-black/20",
            "transition-all duration-300 ease-in-out",
            isCollapsed ? 'w-[72px]' : 'w-72'
          )}
        >
          <SidebarContent {...props} onModuleChange={handleModuleClick} onLogoClick={handleLogoClick} />
        </aside>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
};

// --- SHARED SIDEBAR CONTENT (REFACTORED) ---
const SidebarContent: React.FC<Omit<ResponsiveSidebarProps, 'userEmail'> & { onLogoClick: () => void, userEmail: string }> = (props) => {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const { modules, activeModule, onModuleChange, onLogoClick, userEmail } = props;

  return (
    <div className="flex h-full flex-col">
      {/* Logo/Brand */}
      <button onClick={onLogoClick} className={cn("flex items-center gap-4 border-b p-4 transition-colors hover:bg-primary/5 h-[73px]", isCollapsed && 'justify-center')} aria-label="Go to homepage">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center flex-shrink-0">
          <Bot className="w-6 h-6 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <h2 className="text-xl font-bold tracking-tight">Aureeture</h2>
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2" aria-label="Main navigation">
        {modules.map((module) => <NavItem key={module.id} module={module} isActive={activeModule === module.id} onClick={() => onModuleChange(module.id)} />)}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t p-3 space-y-1">
        <FooterButton isCollapsed={isCollapsed} icon={Settings} tooltip="Settings" onClick={props.onSettingsClick} />
        <FooterButton isCollapsed={isCollapsed} icon={Bell} tooltip="Notifications" onClick={props.onNotificationsClick} />
        
        {/* NEW: User Info Section */}
        <div className="border-t pt-2 mt-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={cn("w-full h-12 gap-3", isCollapsed ? 'justify-center px-0' : 'justify-start px-3')}>
                        <UserCircle className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium text-muted-foreground truncate text-left">
                                    {userEmail}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Button>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right"><p>{userEmail}</p></TooltipContent>}
            </Tooltip>
        </div>

        {/* NEW: Improved Collapse Toggle */}
        <Button variant="ghost" className="w-full justify-center text-muted-foreground" onClick={toggleCollapse}>
          <ChevronsLeft className={cn("h-5 w-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </Button>
      </div>
    </div>
  );
};

// --- CHILD COMPONENTS ---
const NavItem: React.FC<{ module: Module, isActive: boolean, onClick: () => void }> = ({ module, isActive, onClick }) => {
  const { isCollapsed } = useSidebar();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button onClick={onClick} className={cn("w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left relative", isActive ? 'text-primary' : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground')}>
          {isActive && <motion.div className="absolute inset-0 bg-primary/10 rounded-lg z-0" layoutId="activeHighlight" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
          <div className={cn("relative z-10 flex items-center gap-3", isCollapsed && 'justify-center w-full')}>
            <module.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-medium text-sm whitespace-nowrap">{module.name}</motion.span>}
            </AnimatePresence>
          </div>
        </motion.button>
      </TooltipTrigger>
      {isCollapsed && <TooltipContent side="right"><p>{module.name}</p></TooltipContent>}
    </Tooltip>
  );
};

const FooterButton: React.FC<{ isCollapsed: boolean, icon: React.FC<any>, tooltip: string, onClick?: () => void }> = ({ isCollapsed, icon: Icon, tooltip, onClick }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size={isCollapsed ? "icon" : "sm"} className="text-muted-foreground hover:text-foreground w-full" onClick={onClick}>
        <Icon className="h-5 w-5" />
        <AnimatePresence>
          {!isCollapsed && <span className="ml-2 font-medium text-sm">{tooltip}</span>}
        </AnimatePresence>
      </Button>
    </TooltipTrigger>
    {isCollapsed && <TooltipContent side="right"><p>{tooltip}</p></TooltipContent>}
  </Tooltip>
);

export default ResponsiveSidebar;