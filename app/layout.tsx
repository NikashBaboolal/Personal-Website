import type { Metadata, Viewport } from "next";
import { Archivo, DM_Mono, Geist_Mono, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { getSEO, rootTitle, siteConfig } from "@/lib/seo";
import { CursorGlow } from "@/components/layout/cursor-glow";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { MotionProvider } from "@/components/layout/motion-provider";

import "./globals.css";

export const metadata: Metadata = {
  ...getSEO(),
  metadataBase: new URL(siteConfig.url),
  title: rootTitle,
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA" data-scroll-behavior="smooth">
      <body
        className={cn(
          inter.variable,
          archivo.variable,
          geistMono.variable,
          dmMono.variable,
          "bg-background relative font-sans antialiased",
        )}
      >
        <a
          href="#main"
          className="bg-flame text-night focus-visible:ring-night sr-only z-[100] rounded-full px-5 py-3 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus-visible:ring-2 focus-visible:outline-none"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SmoothScroll>
            <ScrollProgress />
            <Navbar />
            <main id="main" tabIndex={-1} className="relative outline-none">
              {children}
            </main>
            <Footer />
            <CursorGlow />
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
