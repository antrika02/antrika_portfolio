"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Moon, Sun, Menu, X, Download } from "lucide-react";
import { profile } from "@/data/profile";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#stats", label: "Coding" },
  { href: "#contact", label: "Contact" },
];

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  return (
    <button
      aria-label="Toggle light and dark theme"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="glass grid h-10 w-10 place-items-center rounded-full transition hover:scale-105"
    >
      {/* CSS decides which icon shows, so there is no flash before hydration */}
      <Sun size={18} className="hidden dark:block" />
      <Moon size={18} className="dark:hidden" />
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div className="bg-gradient-brand h-[2px] origin-left" style={{ scaleX: progress }} />
      <nav
        className={`mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full px-4 py-2 transition-all duration-500 sm:px-5 ${
          scrolled ? "glass mx-3 shadow-lg shadow-black/10 sm:mx-auto" : ""
        }`}
      >
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="bg-gradient-brand grid h-8 w-8 place-items-center rounded-lg text-sm text-white">
            {profile.initials}
          </span>
          <span className="hidden sm:inline">
            {profile.firstName}
            <span className="text-a2">.dev</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`relative rounded-full px-3 py-1.5 text-sm transition ${
                  active === l.href ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {active === l.href && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-line" />
                )}
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.resume}
            download
            className="bg-gradient-brand hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-a1/30 transition hover:scale-105 sm:flex"
          >
            <Download size={15} /> Resume
          </a>
          <ThemeToggle />
          <button
            className="glass grid h-10 w-10 place-items-center rounded-full md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass mx-3 mt-2 rounded-3xl p-4 md:hidden"
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-lg">
                {l.label}
              </a>
            ))}
            <a
              href={profile.resume}
              download
              className="bg-gradient-brand mt-2 flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-semibold text-white"
            >
              <Download size={16} /> Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
