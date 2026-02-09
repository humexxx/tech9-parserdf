"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return <>{children}</>;
}

export function DialogTrigger({ 
  children, 
  asChild 
}: { 
  children: React.ReactNode; 
  asChild?: boolean;
}) {
  return <>{children}</>;
}

interface DialogContentProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export function DialogContent({ children, onClick }: DialogContentProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const dialog = dialogRef.current?.closest('[role="dialog"]');
        if (dialog) {
          const closeButton = dialog.querySelector('[data-close-dialog]') as HTMLButtonElement;
          closeButton?.click();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const dialogElement = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClick}
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 animate-in fade-in-0"
        onClick={(e) => {
          e.stopPropagation();
          const closeButton = e.currentTarget.parentElement?.querySelector('[data-close-dialog]') as HTMLButtonElement;
          closeButton?.click();
        }}
      />
      
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        className="relative z-[10000] grid w-full max-w-lg gap-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-lg rounded-lg animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  // Render in a portal to ensure it's at the root level
  return typeof window !== 'undefined' ? createPortal(dialogElement, document.body) : null;
}

export function DialogHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col space-y-1.5 text-left ${className}`}>
      {children}
    </div>
  );
}

export function DialogFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-zinc-500 dark:text-zinc-400 ${className}`}>
      {children}
    </p>
  );
}

export function DialogClose({ 
  children,
  onClick 
}: { 
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      data-close-dialog
      onClick={onClick}
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-zinc-950 dark:focus:ring-zinc-300"
    >
      {children || <X className="h-4 w-4" />}
      <span className="sr-only">Close</span>
    </button>
  );
}

