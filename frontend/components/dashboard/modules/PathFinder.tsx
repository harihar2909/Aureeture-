"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Users, 
  ExternalLink,
  ChevronRight,
  Star,
  Clock,
  MapPin,
  Building,
  RefreshCw,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePath } from "@/contexts/PathContext";
import { useProfile } from "@/contexts/ProfileContext";
import ChangePathModal from "../ChangePathModal";

// Widget wrapper component
const Widget: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={`bg-card/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-border/20 dark:border-white/10 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-black/20 ${className}`}
  >
    {children}
  </motion.div>
);

const PathFinder: React.FC = () => {
  const { currentPath } = usePath();
  const { profile, getDisplayName } = useProfile();
  const [isChangePathModalOpen, setIsChangePathModalOpen] = useState(false);

  const stats = [
    { label: 'Path Progress', value: '65%', color: 'text-blue-500', icon: TrendingUp },
    { label: 'Skills Acquired', value: '12/18', color: 'text-green-500', icon: CheckCircle },
    { label: 'Next Milestone', value: '3 weeks', color: 'text-purple-500', icon: Target }
  ];

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center">
              <Map className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Path Finder</h1>
              <p className="text-muted-foreground">Navigate your career journey with AI-powered guidance</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsChangePathModalOpen(true)}
            className="gap-2 hover:scale-105 transition-transform"
          >
            <RefreshCw className="w-4 h-4" />
            Change Path
          </Button>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Current Path Overview */}
          <Widget className="lg:col-span-2 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">My {currentPath.category} Path</h2>
                <p className="text-lg text-primary font-semibold">"{currentPath.description}"</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {currentPath.timeline}
              </Badge>
            </div>

            {/* Profile Info */}
            <div className="bg-background/50 dark:bg-black/20 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Profile Info
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Education:</span> {profile.education || 'B.Tech CSE (2025), IIT Bombay'}</p>
                <p><span className="text-muted-foreground">Current Role:</span> {currentPath.title} {profile.company ? `at ${profile.company}` : '(2026), Aureeture Launchpad'}</p>
                <p><span className="text-muted-foreground">Location:</span> {profile.location || 'Mumbai, India'}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-4 bg-background/30 dark:bg-black/10 rounded-xl">
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </Widget>

          {/* Next Step & Guidance */}
          <Widget className="p-6">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Your Next Step
            </h3>
            <div className="space-y-4">
              {currentPath.nextSteps.slice(0, 2).map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-background/50 dark:bg-black/20 rounded-lg">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm">{step}</p>
                </div>
              ))}
              
              <div className="pt-4 space-y-2">
                <Button className="w-full gap-2" size="sm">
                  <Zap className="w-4 h-4" />
                  Explore Launchpad
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  size="sm"
                  onClick={() => setIsChangePathModalOpen(true)}
                >
                  <RefreshCw className="w-4 h-4" />
                  Change Path
                </Button>
              </div>
            </div>
          </Widget>

          {/* Skill Gap Analysis */}
          <Widget className="lg:col-span-2 p-6">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Skill Gap Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPath.skillGaps.map((skill, index) => (
                <div key={index} className="p-4 bg-background/50 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{skill}</span>
                    <Badge variant="outline" className="text-xs">
                      Priority {index < 2 ? 'High' : 'Medium'}
                    </Badge>
                  </div>
                  <Progress value={Math.random() * 40 + 10} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {index < 2 ? 'Critical for next milestone' : 'Recommended for growth'}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Recommended Resources
              </h4>
              <div className="space-y-3">
                {currentPath.resources.slice(0, 2).map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/30 dark:bg-black/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{resource.title}</p>
                        <p className="text-xs text-muted-foreground">{resource.provider} • {resource.duration}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Widget>

          {/* Achievements & Progress */}
          <Widget className="p-6">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-4">
              {currentPath.achievements.map((achievement, index) => (
                <div key={index} className="p-3 bg-background/50 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-sm">{achievement.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                  {achievement.progress && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Widget>

          {/* Curated Opportunities */}
          <Widget className="lg:col-span-3 p-6">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Curated Opportunities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPath.opportunities.map((opportunity, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {opportunity.company}
                        </p>
                      </div>
                      <Badge 
                        variant={opportunity.type === 'startup' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {opportunity.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {opportunity.location}
                        </span>
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <Star className="w-3 h-3 fill-current" />
                          {opportunity.matchPercentage}% match
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {opportunity.skills.slice(0, 3).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button className="w-full gap-2" size="sm">
                        Apply Now
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Widget>
        </div>
      </main>

      {/* Change Path Modal */}
      <ChangePathModal 
        isOpen={isChangePathModalOpen}
        onClose={() => setIsChangePathModalOpen(false)}
      />
    </div>
  );
};

export default PathFinder;
