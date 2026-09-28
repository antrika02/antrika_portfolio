import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers";
import "./globals.css";

// Self-hosted variable fonts (no network needed at build time)
const display = localFont({ src: "../fonts/sora-latin-wght-normal.woff2", variable: "--ff-display", weight: "100 800" });
const body = localFont({ src: "../fonts/inter-latin-wght-normal.woff2", variable: "--ff-body", weight: "100 900" });
const code = localFont({ src: "../fonts/jetbrains-mono-latin-wght-normal.woff2", variable: "--ff-code", weight: "100 800" });

export const metadata: Metadata = {
  title: "Antrika Kashyap — Backend & AI Engineer",
  description:
    "Portfolio of Antrika Kashyap: backend engineer and AI builder. Spring Boot, FastAPI, RAG, LLM agents, 1,400+ DSA problems solved.",
  openGraph: {
    title: "Antrika Kashyap — Backend & AI Engineer",
    description: "Backends that stay correct under load, and AI that knows when not to trust itself.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06060c" },
    { media: "(prefers-color-scheme: light)", color: "#f6f6fb" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${code.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
