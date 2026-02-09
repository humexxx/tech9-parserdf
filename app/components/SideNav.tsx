"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  id: string;
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { id: "resume-converter", label: "Resume Converter", href: "/resume-converter" },
  { id: "tech9-resumes", label: "Tech9 Resumes", href: "/resumes" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-17 left-0 w-44 h-[calc(100vh-68px)] bg-white dark:bg-zinc-950 border-r border-[#D4D4D4] dark:border-zinc-800 py-6 flex flex-col gap-3">
      {navItems.map((item) => {
        const isSelected = pathname === item.href;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`
              w-43.75 h-10.25 px-6 py-3 flex items-center gap-2.5 text-left transition-colors
              ${
                isSelected
                  ? "bg-[#F8F7F3] dark:bg-zinc-900 border-r-[5px] border-r-black dark:border-r-white"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }
            `}
          >
            <span className="text-black dark:text-white text-sm leading-4.25 w-32">
              {item.label}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
