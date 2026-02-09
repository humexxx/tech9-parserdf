"use client";

import { Resume } from "@/app/types/database";
import ResumeCard from "./ResumeCard";
import { Loader2 } from "lucide-react";

interface ResumesListProps {
    favorites: Resume[];
    recent: Resume[];
    isLoading: boolean;
    onToggleFavorite: (id: string, isFavorite: boolean) => void;
    onDelete: (id: string) => void;
    onResumeClick: (resume: Resume) => void;
}

export default function ResumesList({
    favorites,
    recent,
    isLoading,
    onToggleFavorite,
    onDelete,
    onResumeClick,
}: ResumesListProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-[#3CBCEC] mb-4" />
                <p className="text-gray-600 dark:text-zinc-400">Loading resumes...</p>
            </div>
        );
    }

    const hasNoResumes = favorites.length === 0 && recent.length === 0;

    if (hasNoResumes) {
        return (
            <div className="space-y-12">
                {/* Empty state with same spacing as sections */}
                <section>
                    <div className="px-16 flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-300 dark:border-zinc-700 rounded-lg">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
                        <p className="text-gray-600 dark:text-zinc-400 max-w-md">
                            Start by converting your first resume using the Resume Converter.
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Saved Section */}
            {favorites.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6">
                        Saved ({favorites.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((resume) => (
                            <ResumeCard
                                key={resume.id}
                                resume={resume}
                                onToggleFavorite={onToggleFavorite}
                                onDelete={onDelete}
                                onClick={onResumeClick}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Recent Section */}
            {recent.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6">
                        Recent (Last 30 days) ({recent.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recent.map((resume) => (
                            <ResumeCard
                                key={resume.id}
                                resume={resume}
                                onToggleFavorite={onToggleFavorite}
                                onDelete={onDelete}
                                onClick={onResumeClick}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
