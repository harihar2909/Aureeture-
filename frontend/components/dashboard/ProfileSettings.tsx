"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Camera, 
  Save, 
  X,
  Upload
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserProfile as ContextUserProfile } from "@/contexts/ProfileContext";

// Internal modal profile extends the context shape with UI-specific fields.
type ModalProfile = ContextUserProfile & {
  firstName: string;
  lastName: string;
  phone: string;
  skills: string[];
};

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ContextUserProfile;
  onSave: (profile: ContextUserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSave
}) => {
  // Hydrate context profile into modal profile shape with sensible defaults
  const hydrate = (p: ContextUserProfile): ModalProfile => {
    const name = (p.name || "").trim();
    const parts = name.split(" ").filter(Boolean);
    const firstName = parts[0] || "";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
    return {
      ...p,
      firstName,
      lastName,
      phone: (p as any).phone ?? "",
      skills: (p as any).skills ?? [],
      profilePicture: p.profilePicture ?? "",
      bio: p.bio ?? "",
      jobTitle: p.jobTitle ?? "",
      company: p.company ?? "",
      education: p.education ?? "",
      location: p.location ?? "",
      email: p.email ?? "",
    };
  };

  const [profile, setProfile] = useState<ModalProfile>(hydrate(currentProfile));
  const [isLoading, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep local state in sync when the upstream profile changes
  useEffect(() => {
    setProfile(hydrate(currentProfile));
  }, [currentProfile]);

  const handleInputChange = (field: keyof ModalProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfile(prev => ({
          ...prev,
          profilePicture: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Map back to the context profile shape for persistence
    const merged: ContextUserProfile = {
      name: [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() || profile.name || '',
      email: profile.email || '',
      profilePicture: profile.profilePicture || '',
      bio: profile.bio || '',
      jobTitle: profile.jobTitle || '',
      company: profile.company || '',
      education: profile.education || '',
      location: profile.location || '',
    };
    onSave(merged);
    setSaving(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      handleAddSkill();
    }
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
              Profile Settings
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Update your personal information and preferences
            </p>
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
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-8">
            
            {/* Profile Picture Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.profilePicture || ''} alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      {(profile.firstName?.[0] || profile.name?.[0] || 'U').toUpperCase()}{(profile.lastName?.[0] || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload New Picture
                    </Button>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={profile.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your location"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={profile.jobTitle || ''}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      placeholder="Enter your job title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company || ''}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Enter your company"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Education
                  </Label>
                  <Input
                    id="education"
                    value={profile.education || ''}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    placeholder="Enter your education background"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a skill..."
                    className="flex-1"
                  />
                  <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="gap-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/20"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      {skill}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileSettings;
