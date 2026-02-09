"use client";

import { Resume } from "@/app/types/database";
import { Star, Trash2, FileText } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

interface ResumeCardProps {
    resume: Resume;
    onToggleFavorite: (id: string, isFavorite: boolean) => void;
    onDelete: (id: string) => void;
    onClick: (resume: Resume) => void;
}

export default function ResumeCard({
    resume,
    onToggleFavorite,
    onDelete,
    onClick,
}: ResumeCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(resume.id);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to delete resume:", error);
            setIsDeleting(false);
        }
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(resume.id, !resume.isFavorite);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div
            onClick={() => onClick(resume)}
            className={`relative group border border-[#e8e8e8] dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 rounded-lg cursor-pointer transition-all hover:border-[#3CBCEC] ${isDeleting ? "opacity-50 pointer-events-none" : ""
                }`}
        >
            {/* Favorite button */}
            <button
                onClick={handleToggleFavorite}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                title={resume.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                <Star
                    className={`w-5 h-5 ${resume.isFavorite
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                />
            </button>

            {/* Delete button with Dialog */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsDialogOpen(true);
                }}
                className="absolute top-4 right-14 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete resume"
            >
                <Trash2 className="w-5 h-5 text-red-500" />
            </button>

            {/* Delete Confirmation Dialog */}
            {isDialogOpen && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent onClick={(e) => e.stopPropagation()}>
                        <DialogHeader>
                            <DialogTitle>Delete Resume</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete &quot;{resume.name.replace(/\.pdf$/i, "")}&quot;? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Resume icon */}
            <div className="w-12 h-12 bg-[#E6F7FC] dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-[#3CBCEC]" />
            </div>

            {/* Resume name */}
            <h3 className="font-semibold text-lg mb-2 pr-20 truncate">
                {resume.name.replace(/\.pdf$/i, "")}
            </h3>

            {/* Metadata */}
            <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-zinc-400">
                <p>Format: {resume.format}</p>
                <p>Updated: {formatDate(resume.updatedAt)}</p>
            </div>
        </div>
    );
}
