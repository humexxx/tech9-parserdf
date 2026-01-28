import { Database } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-68px)] px-6">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 blur-3xl rounded-full" />
          <Database className="w-20 h-20 text-primary relative" strokeWidth={1.5} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-black dark:text-white">
            {title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {description || "No database connected yet"}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-500">
          <p>Files cannot be saved at the moment.</p>
          <p className="font-medium text-primary">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
