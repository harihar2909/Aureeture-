"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";

const schema = z.object({
  name: z.string().min(2, "Full name is required"),
  college: z.string().min(2, "College is required"),
  degree: z.string().min(2, "Degree is required"),
  graduationYear: z
    .string()
    .regex(/^\d{4}$/g, "Use a 4-digit year e.g., 2026"),
  skills: z.string().min(2, "Add at least one skill"),
  interests: z.string().min(2, "Add at least one interest"),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export default function CreateProfilePage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    if (!isSignedIn || !user) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          name: values.name,
          education: {
            college: values.college,
            degree: values.degree,
            graduationYear: values.graduationYear,
          },
          skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
          interests: values.interests.split(",").map((s) => s.trim()).filter(Boolean),
          bio: values.bio,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to save profile");
      }

      router.push("/dashboard");
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/create-profile" />
      </SignedOut>
      <SignedIn>
        <div className="min-h-[70vh] container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-6">Create Your Profile</h1>
          <p className="text-muted-foreground mb-8">
            Tell us about yourself to personalize your Career Explorer dashboard.
          </p>

          <Card className="max-w-3xl p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input placeholder="e.g., Aditi Sharma" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">College</label>
                  <Input placeholder="e.g., IIT Bombay" {...register("college")} />
                  {errors.college && (
                    <p className="text-red-500 text-sm mt-1">{errors.college.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Degree</label>
                  <Input placeholder="e.g., B.Tech CSE" {...register("degree")} />
                  {errors.degree && (
                    <p className="text-red-500 text-sm mt-1">{errors.degree.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Graduation Year</label>
                  <Input placeholder="e.g., 2026" {...register("graduationYear")} />
                  {errors.graduationYear && (
                    <p className="text-red-500 text-sm mt-1">{errors.graduationYear.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Technical and Soft Skills</label>
                <Input placeholder="e.g., React, Node, Communication" {...register("skills")} />
                {errors.skills && (
                  <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Career Interests / Desired Roles</label>
                <Input placeholder="e.g., Frontend Engineer, Product" {...register("interests")} />
                {errors.interests && (
                  <p className="text-red-500 text-sm mt-1">{errors.interests.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Short Bio (optional)</label>
                <Textarea placeholder="A short summary about you" {...register("bio")} />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save and Continue"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </SignedIn>
    </>
  );
}
