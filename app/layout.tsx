import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import Image from "next/image";
import AppBar from "./components/AppBar";
import SideNav from "./components/SideNav";
import ThemeProvider from "./components/ThemeProvider";
import "./globals.css";

const inconsolata = Inconsolata({
  variable: "--font-inconsolata",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParserDF",
  description: "PDF parser and converter application",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inconsolata.variable} antialiased bg-white dark:bg-black`}
      >
        <ThemeProvider>
          <AppBar />
          <SideNav />
          <main className="relative ml-44 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="opacity-[0.67] relative w-full h-full">
                <div className="absolute inset-0 opacity-20 overflow-hidden">
                  <Image
                    alt=""
                    className="absolute h-[116.94%] right-[-70.42%] max-w-none top-[-50%] w-[170.42%]"
                    src="/gradient.png"
                    width={1920}
                    height={1080}
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
