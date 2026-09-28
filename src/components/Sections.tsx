"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Brain,
  Briefcase,
  CircleCheck,
  Cloud,
  CodeXml,
  Copy,
  Database,
  GraduationCap,
  LayoutTemplate,
  Mail,
  Send,
  Server,
  Sparkles,
  Trophy,
} from "lucide-react";
import { achievements, certifications, education, experience, profile, projects, skills } from "@/data/profile";
import { Avatar } from "./Hero";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { Reveal, Section, TiltCard } from "./ui";

/* ───────────────────────────── About ───────────────────────────── */
export function About() {
  return (
    <Section id="about" eyebrow="about me" title={<>Engineer who cares about <span className="text-gradient">getting it right</span></>}>
      <div className="grid gap-8 md:grid-cols-5">
        <Reveal className="md:col-span-3">
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {profile.about.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15} className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {profile.quickFacts.map((f) => (
              <div key={f.label} className="glass glow-border rounded-2xl p-5">
                <div className="text-gradient font-display text-2xl font-bold sm:text-3xl">{f.value}</div>
                <div className="mt-1 text-sm text-muted">{f.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────────────────────────── Skills ───────────────────────────── */
const iconMap: Record<string, React.ElementType> = {
  code: CodeXml,
  server: Server,
  brain: Brain,
  sparkles: Sparkles,
  database: Database,
  layout: LayoutTemplate,
  cloud: Cloud,
  check: CircleCheck,
};

function Marquee() {
  const all = skills.flatMap((s) => s.items);
  const row = [...all, ...all];
  return (
    <div className="relative -mx-4 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] sm:mx-0">
      <motion.div
        className="flex w-max gap-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
      >
        {row.map((s, i) => (
          <span key={i} className="glass whitespace-nowrap rounded-full px-4 py-2 font-mono text-sm text-muted">
            {s}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Skills() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <Section
      id="skills"
      eyebrow="tech stack"
      title={<>Tools I <span className="text-gradient">build with</span></>}
      subtitle="From Java and Spring Boot backends to RAG pipelines and LLM agents — here's everything in my toolbox."
    >
      <Marquee />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((g, idx) => {
          const Icon = iconMap[g.icon] ?? CodeXml;
          return (
            <Reveal key={g.title} delay={idx * 0.05}>
              <div
                onMouseEnter={() => setHover(g.title)}
                onMouseLeave={() => setHover(null)}
                className={`glass glow-border h-full rounded-3xl p-6 transition duration-300 ${
                  hover && hover !== g.title ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="bg-gradient-brand grid h-10 w-10 place-items-center rounded-xl text-white">
                    <Icon size={19} />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{g.title}</h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-line px-2.5 py-1 text-xs transition hover:border-a2 hover:text-a2"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ─────────────────────────── Experience ─────────────────────────── */
export function Experience() {
  return (
    <Section id="experience" eyebrow="experience" title={<>Where I&apos;ve <span className="text-gradient">shipped</span></>}>
      <div className="relative pl-8 sm:pl-12">
        <div className="bg-gradient-brand absolute left-2.5 top-2 bottom-2 w-[2px] rounded sm:left-4" />
        {experience.map((e) => (
          <Reveal key={e.company}>
            <div className="relative">
              <span className="absolute -left-[27px] top-2 grid h-5 w-5 place-items-center rounded-full bg-bg sm:-left-[37px]">
                <span className="bg-gradient-brand h-3 w-3 rounded-full" />
                <span className="bg-gradient-brand absolute h-5 w-5 animate-ping rounded-full opacity-30" />
              </span>
              <TiltCard className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-bold sm:text-2xl">{e.role}</h3>
                    <p className="mt-1 flex items-center gap-2 text-a2">
                      <Briefcase size={15} /> {e.company} · {e.place}
                    </p>
                  </div>
                  <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">{e.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-3 text-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-a3" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <span key={t} className="rounded-md bg-line px-2.5 py-1 font-mono text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ──────────────────────────── Projects ──────────────────────────── */
const filters = ["All", "AI", "Backend", "Full-Stack"] as const;

export function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const list = projects.filter((p) => filter === "All" || p.category === filter);

  return (
    <Section
      id="projects"
      eyebrow="projects"
      title={<>Things I&apos;ve <span className="text-gradient">built</span></>}
      subtitle="Each one is built around a real engineering problem — concurrency, trust in AI output, retrieval quality, or scale."
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === f ? "text-white" : "glass text-muted hover:text-fg"
            }`}
          >
            {filter === f && <motion.span layoutId="proj-pill" className="bg-gradient-brand absolute inset-0 -z-10 rounded-full" />}
            {f}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.div
              key={p.title}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35 }}
            >
              <TiltCard className="flex h-full flex-col p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-line px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-a2">
                        {p.category}
                      </span>
                      {p.badge && (
                        <span className="rounded-md border border-a3/40 px-2 py-0.5 text-[11px] font-medium text-a3">{p.badge}</span>
                      )}
                    </div>
                    <h3 className="mt-3 font-display text-xl font-bold sm:text-2xl">{p.title}</h3>
                  </div>
                  {p.metric && (
                    <div className="shrink-0 text-right">
                      <div className="text-gradient font-display text-2xl font-extrabold sm:text-3xl">{p.metric.value}</div>
                      <div className="max-w-[90px] text-[11px] leading-tight text-muted">{p.metric.label}</div>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-muted">{p.blurb}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <CircleCheck size={16} className="mt-0.5 shrink-0 text-a2" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span key={s} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex gap-4 text-sm font-semibold">
                    <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-a2">
                      <GithubIcon size={16} /> Code
                    </a>
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-a2">
                        Live demo <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Reveal className="mt-10 text-center">
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noreferrer"
          className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition hover:scale-105"
        >
          <GithubIcon size={18} /> More on GitHub <ArrowUpRight size={16} />
        </a>
      </Reveal>
    </Section>
  );
}

/* ────────────────────── Education & Achievements ────────────────────── */
export function EducationAchievements() {
  return (
    <Section id="achievements" eyebrow="education & wins" title={<>Learning & <span className="text-gradient">milestones</span></>}>
      <div className="grid gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="space-y-5">
            {education.map((ed) => (
              <TiltCard key={ed.school} className="p-7">
                <span className="bg-gradient-brand grid h-12 w-12 place-items-center rounded-2xl text-white">
                  <GraduationCap size={22} />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold">{ed.school}</h3>
                <p className="mt-1 text-muted">{ed.degree}</p>
                <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
                  <span className="rounded-full border border-line px-3 py-1">{ed.period}</span>
                  <span className="rounded-full border border-a2/40 px-3 py-1 text-a2">{ed.detail}</span>
                </div>
              </TiltCard>
            ))}
            <div className="glass rounded-3xl p-7">
              <h4 className="flex items-center gap-2 font-display font-semibold">
                <Award size={18} className="text-a3" /> Certifications
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {certifications.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-a2" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          {achievements.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06}>
              <div className="glass glow-border h-full rounded-3xl p-6">
                <Trophy size={22} className="text-a1" />
                <h4 className="mt-4 font-display font-semibold">{a.title}</h4>
                <p className="mt-1 text-sm text-muted">{a.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────────────── Contact ───────────────────────────── */
export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // No Formspree ID yet? Fall back to opening the visitor's email app.
    if (!formId) {
      const subject = encodeURIComponent(`Hello from ${data.get("name")}`);
      const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const input =
    "w-full rounded-xl border border-line bg-bg-soft/60 px-4 py-3 outline-none transition placeholder:text-muted/70 focus:border-a1 focus:ring-2 focus:ring-a1/25";

  return (
    <Section id="contact" eyebrow="contact" title={<>Let&apos;s <span className="text-gradient">build something</span></>}>
      <div className="grid gap-8 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="glass relative h-full overflow-hidden rounded-3xl p-8">
            <div className="bg-gradient-brand absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-25 blur-3xl" />
            <Avatar size={84} />
            <p className="mt-6 text-lg text-muted">
              I&apos;m actively looking for <span className="text-fg">SDE, Backend and AI Engineer</span> roles and can join
              immediately. The fastest way to reach me is email.
            </p>
            <button onClick={copy} className="mt-6 flex w-full items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-left transition hover:border-a2">
              <span className="flex items-center gap-2 truncate">
                <Mail size={17} className="text-a2" /> {profile.email}
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                <Copy size={14} /> {copied ? "Copied!" : "Copy"}
              </span>
            </button>
            <div className="mt-4 flex gap-3">
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm transition hover:border-a2">
                <LinkedinIcon size={16} /> LinkedIn
              </a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm transition hover:border-a2">
                <GithubIcon size={16} /> GitHub
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-3">
          <form onSubmit={onSubmit} className="glass rounded-3xl p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">Your name</span>
                <input name="name" required className={input} placeholder="Jane from Acme" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">Email</span>
                <input name="email" type="email" required className={input} placeholder="jane@acme.com" />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm text-muted">Message</span>
              <textarea name="message" required rows={6} className={input} placeholder="We'd love to talk about a Backend Engineer role…" />
            </label>
            <button
              disabled={status === "sending"}
              className="bg-gradient-brand mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white shadow-lg shadow-a1/25 transition hover:scale-[1.02] disabled:opacity-60"
            >
              <Send size={17} /> {status === "sending" ? "Sending…" : "Send message"}
            </button>
            <AnimatePresence>
              {status === "sent" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-emerald-400">
                  Thanks! Your message is on its way — I&apos;ll reply soon.
                </motion.p>
              )}
              {status === "error" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-a3">
                  Something went wrong. Please email me directly at {profile.email}.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, Tailwind, three.js & Gemini.
        </p>
        <a href="#top" className="hover:text-fg">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
