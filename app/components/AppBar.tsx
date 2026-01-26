import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { version } from "../../package.json";

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
          <h1 className="text-xl font-semibold">| ParserDF</h1>
          <span className="text-sm text-muted-foreground">v{version}</span>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
