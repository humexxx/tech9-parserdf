"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { version } from "../../package.json";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), { ssr: false });

export default function AppBar() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border flex items-center justify-between px-6 py-4 w-full">
      <div className="flex items-center gap-4">
        <div className="h-9 w-32 relative" style={{ aspectRatio: '32/9' }}>
          <Image
            src="/logo.svg"
            alt="Logo"
            fill
            className="object-contain dark:invert"
            priority
            unoptimized
          />
        </div>
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-semibold pl-0.5">| ParserDF</h1>
          <span className="text-sm text-muted-foreground">v{version}</span>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
