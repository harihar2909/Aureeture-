"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Briefcase, 
  Rocket, 
  BarChart3, 
  Code, 
  Brain,
  Users,
  CheckCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePath, CareerPath } from "@/contexts/PathContext";

interface ChangePathModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const pathIcons = {
  'software-developer': Code,
  'ai-startup-founder': Rocket,
  'data-scientist': BarChart3,
  'product-manager': Users,
  'designer': Brain,
  'consultant': Briefcase
};

const ChangePathModal: React.FC<ChangePathModalProps> = ({ isOpen, onClose }) => {
  const { currentPath, availablePaths, changePath } = usePath();
  const [selectedPath, setSelectedPath] = useState<string>(currentPath.id);
  const [isChanging, setIsChanging] = useState(false);

  const handlePathChange = async () => {
    if (selectedPath === currentPath.id) {
      onClose();
      return;
    }

    setIsChanging(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    changePath(selectedPath);
    setIsChanging(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Change Your Career Path
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              From which path do you want to change your current path?
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-slate-500">Current Path:</span>
              <Badge variant="secondary" className="gap-2">
                {React.createElement(pathIcons[currentPath.id as keyof typeof pathIcons] || Briefcase, { className: "w-3 h-3" })}
                {currentPath.title}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availablePaths.map((path) => {
                const Icon = pathIcons[path.id as keyof typeof pathIcons] || Briefcase;
                const isSelected = selectedPath === path.id;
                const isCurrent = currentPath.id === path.id;
                
                return (
                  <Card
                    key={path.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    } ${isCurrent ? 'opacity-50' : ''}`}
                    onClick={() => !isCurrent && setSelectedPath(path.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{path.title}</h3>
                            {isCurrent && (
                              <Badge variant="outline" className="text-xs">
                                Current
                              </Badge>
                            )}
                            {isSelected && !isCurrent && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                            {path.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {path.category}
                              </Badge>
                            </span>
                            <span>{path.timeline}</span>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-slate-500 mb-2">Key Focus Areas:</p>
                            <div className="flex flex-wrap gap-1">
                              {path.skillGaps.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {path.skillGaps.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{path.skillGaps.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {selectedPath !== currentPath.id ? (
              <>
                Switching to: <span className="font-medium text-slate-900 dark:text-slate-100">
                  {availablePaths.find(p => p.id === selectedPath)?.title}
                </span>
              </>
            ) : (
              'Select a different path to continue'
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} disabled={isChanging}>
              Cancel
            </Button>
            <Button 
              onClick={handlePathChange} 
              disabled={isChanging || selectedPath === currentPath.id}
              className="gap-2"
            >
              {isChanging ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {isChanging ? 'Updating Path...' : 'Change Path'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChangePathModal;
