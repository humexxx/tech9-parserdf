import { ReactNode, createElement } from "react";

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function Heading({ children, level = 1, className = "" }: HeadingProps) {
  const baseStyles = "font-bold text-[#0a0a0a] dark:text-white";
  
  const sizeStyles = {
    1: "text-[40px] leading-normal",
    2: "text-[32px] leading-normal",
    3: "text-[28px] leading-normal",
    4: "text-[24px] leading-normal",
    5: "text-[20px] leading-normal",
    6: "text-[18px] leading-normal",
  };

  const tag = `h${level}`;

  return createElement(
    tag,
    { className: `${baseStyles} ${sizeStyles[level]} ${className}` },
    children
  );
}

interface TextProps {
  children: ReactNode;
  variant?: "body" | "caption" | "small";
  className?: string;
}

export function Text({ children, variant = "body", className = "" }: TextProps) {
  const variants = {
    body: "text-[20px] leading-normal text-[#0a0a0a] dark:text-zinc-300",
    caption: "text-[16px] leading-[24px] text-[#18181b] dark:text-zinc-300",
    small: "text-[14px] leading-[20px] text-[#52525b] dark:text-zinc-400",
  };

  return <p className={`font-inconsolata ${variants[variant]} ${className}`}>{children}</p>;
}
