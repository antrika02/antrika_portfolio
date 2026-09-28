"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Bot, Download, MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon, LeetcodeIcon, CodeforcesIcon, CodechefIcon } from "./BrandIcons";

const ParticleHero = dynamic(() => import("./ParticleHero"), { ssr: false });

function Typewriter({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    const speed = deleting ? 40 : 85;
    const t = setTimeout(() => {
      if (!deleting && text === word) {
        setTimeout(() => setDeleting(true), 1400);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setI((n) => n + 1);
        return;
      }
      setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, i, words]);

  return (
    <span className="text-gradient">
      {text}
      <span className="caret ml-0.5 inline-block w-[3px] rounded bg-a2 align-middle" style={{ height: "0.9em" }} />
    </span>
  );
}

export function Avatar({ size = 132 }: { size?: number }) {
  return (
    <div className="animate-float relative" style={{ width: size, height: size }}>
      <div className="bg-gradient-brand absolute -inset-[3px] animate-[spin_8s_linear_infinite] rounded-full blur-[2px]" />
      <div className="absolute inset-0 grid place-items-center overflow-hidden rounded-full bg-bg">
        {profile.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-gradient font-display font-extrabold" style={{ fontSize: size * 0.36 }}>
            {profile.initials}
          </span>
        )}
      </div>
      <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-bg bg-emerald-400" title="Open to work">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
      </span>
    </div>
  );
}

const socials = [
  { href: profile.socials.github, label: "GitHub", Icon: GithubIcon },
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: profile.socials.leetcode, label: "LeetCode", Icon: LeetcodeIcon },
  { href: profile.socials.codeforces, label: "Codeforces", Icon: CodeforcesIcon },
  { href: profile.socials.codechef, label: "CodeChef", Icon: CodechefIcon },
];

export default function Hero() {
  const openChat = () => window.dispatchEvent(new CustomEvent("open-chat"));

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <ParticleHero />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg)_78%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-28 pb-20 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex justify-center"
        >
          <Avatar />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium sm:text-sm"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Open to SDE, Backend & AI roles
          <span className="hidden text-muted sm:inline">·</span>
          <span className="hidden items-center gap-1 text-muted sm:inline-flex">
            <MapPin size={13} /> {profile.location}
          </span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl"
        >
          Hi, I&apos;m {profile.firstName}
          <span className="text-a3">.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5 h-10 font-display text-2xl font-semibold sm:text-4xl"
        >
          <Typewriter words={profile.roles} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            onClick={openChat}
            className="bg-gradient-brand group flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white shadow-xl shadow-a1/30 transition hover:scale-105 sm:w-auto"
          >
            <Bot size={18} className="transition group-hover:rotate-12" /> Ask my AI about me
          </button>
          <a
            href="#projects"
            className="glass flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold transition hover:scale-105 sm:w-auto"
          >
            See my work
          </a>
          <a
            href={profile.resume}
            download
            className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 font-semibold text-muted transition hover:text-fg sm:w-auto"
          >
            <Download size={16} /> Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex justify-center gap-3"
        >
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
              className="glass grid h-11 w-11 place-items-center rounded-full text-muted transition hover:-translate-y-1 hover:text-fg"
            >
              <Icon size={19} />
            </a>
          ))}
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-muted transition hover:text-fg"
      >
        <ArrowDown className="animate-bounce" />
      </a>
    </section>
  );
}
