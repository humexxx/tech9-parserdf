import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
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
        className={`${inconsolata.variable} antialiased`}
      >
        <ThemeProvider>
          <AppBar />
          <SideNav />
          <main className="ml-44">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
