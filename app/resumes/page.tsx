"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Resume } from "../types/database";
import ResumesList from "../components/resumes/ResumesList";
import { ResumesListSkeleton } from "../components/resumes/ResumeSkeleton";
import { Heading, Text } from "../components/Typography";

export default function Tech9ResumesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Resume[]>([]);
  const [recent, setRecent] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResumes();
    // Trigger cleanup on mount
    cleanupOldResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/resumes");
      if (!response.ok) throw new Error("Failed to fetch resumes");

      const data = await response.json();
      setFavorites(data.favorites || []);
      setRecent(data.recent || []);
    } catch (error) {
      console.error("Error loading resumes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cleanupOldResumes = async () => {
    try {
      await fetch("/api/resumes/cleanup", { method: "POST" });
    } catch (error) {
      console.error("Error cleaning up old resumes:", error);
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    // Optimistic update - update UI immediately
    const updateResume = (resume: Resume) => 
      resume.id === id ? { ...resume, isFavorite } : resume;

    const prevFavorites = [...favorites];
    const prevRecent = [...recent];

    // Find the resume in either list
    const resumeInFavorites = favorites.find(r => r.id === id);
    const resumeInRecent = recent.find(r => r.id === id);

    if (isFavorite) {
      // Moving to favorites
      const resume = resumeInRecent || resumeInFavorites;
      if (resume) {
        setFavorites(prev => [...prev, { ...resume, isFavorite: true }]);
        setRecent(prev => prev.filter(r => r.id !== id));
      }
    } else {
      // Removing from favorites
      const resume = resumeInFavorites;
      if (resume) {
        setFavorites(prev => prev.filter(r => r.id !== id));
        setRecent(prev => [...prev, { ...resume, isFavorite: false }]);
      }
    }

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite }),
      });

      if (!response.ok) {
        // Revert on error
        setFavorites(prevFavorites);
        setRecent(prevRecent);
        throw new Error("Failed to toggle favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // State already reverted above
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete resume");

      // Remove from local state
      setFavorites((prev) => prev.filter((r) => r.id !== id));
      setRecent((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  const handleResumeClick = (resume: Resume) => {
    router.push(`/resumes/${resume.id}`);
  };

  return (
    <div className="flex pt-6 pl-6">
      <div className="flex flex-col gap-8 items-start w-full max-w-302.5">
        <div className="flex flex-col gap-2 items-start w-full">
          <Heading level={1}>Tech9 Resumes</Heading>
          <Text>Manage your converted resumes</Text>
        </div>

        {isLoading ? (
          <ResumesListSkeleton />
        ) : (
          <ResumesList
            favorites={favorites}
            recent={recent}
            isLoading={isLoading}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            onResumeClick={handleResumeClick}
          />
        )}
      </div>
    </div>
  );
}
