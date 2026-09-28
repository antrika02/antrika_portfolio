"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Flame, CalendarDays, Trophy } from "lucide-react";
import { fallbackStats, profile } from "@/data/profile";
import { CountUp, Reveal, Section } from "./ui";
import { CodechefIcon, CodeforcesIcon, LeetcodeIcon } from "./BrandIcons";

type Point = { t: number; r: number };
type Stats = {
  leetcode: typeof fallbackStats.leetcode & { history: Point[] };
  codeforces: typeof fallbackStats.codeforces & { history: Point[] };
  codechef: typeof fallbackStats.codechef;
  live: { leetcode: boolean; codeforces: boolean; codechef: boolean };
};

const initial: Stats = {
  leetcode: { ...fallbackStats.leetcode, history: [] },
  codeforces: { ...fallbackStats.codeforces, history: [] },
  codechef: fallbackStats.codechef,
  live: { leetcode: false, codeforces: false, codechef: false },
};

/* LeetCode difficulty donut — 3 arcs with 2° gaps, direct-labelled legend */
function DifficultyRing({ easy, medium, hard, solved }: { easy: number; medium: number; hard: number; solved: number }) {
  const [hover, setHover] = useState<string | null>(null);
  const total = easy + medium + hard || 1;
  const R = 80;
  const C = 2 * Math.PI * R;
  const gap = 6;
  const parts = [
    { key: "Easy", v: easy, color: "var(--easy)" },
    { key: "Medium", v: medium, color: "var(--medium)" },
    { key: "Hard", v: hard, color: "var(--hard)" },
  ];
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-48 w-48 shrink-0">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={R} fill="none" stroke="var(--line)" strokeWidth="14" />
          {parts.map((p) => {
            const len = (p.v / total) * C - gap;
            const el = (
              <motion.circle
                key={p.key}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={p.color}
                strokeWidth={hover === p.key ? 18 : 14}
                strokeLinecap="round"
                strokeDasharray={`${Math.max(len, 0)} ${C}`}
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: `0 ${C}` }}
                whileInView={{ strokeDasharray: `${Math.max(len, 0)} ${C}` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHover(p.key)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer", transition: "stroke-width .2s" }}
              />
            );
            offset += (p.v / total) * C;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-display text-4xl font-extrabold">
              {hover ? parts.find((p) => p.key === hover)!.v : <CountUp to={solved} />}
            </div>
            <div className="text-xs text-muted">{hover ? `${hover} solved` : "solved on LeetCode"}</div>
          </div>
        </div>
      </div>
      <ul className="grid w-full grid-cols-3 gap-2">
        {parts.map((p) => (
          <li
            key={p.key}
            onMouseEnter={() => setHover(p.key)}
            onMouseLeave={() => setHover(null)}
            className={`rounded-xl border border-line px-3 py-2.5 text-center transition ${
              hover === p.key ? "bg-line" : ""
            }`}
          >
            <span className="flex items-center justify-center gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.key}
            </span>
            <span className="mt-1 block font-display text-lg font-bold">{p.v}</span>
            <span className="block font-mono text-[11px] text-muted">{Math.round((p.v / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Rating history line with crosshair tooltip (single series at a time) */
function RatingChart({ data, color, id }: { data: Point[]; color: string; id: string }) {
  const [idx, setIdx] = useState<number | null>(null);
  const W = 600;
  const H = 220;
  const pad = { l: 44, r: 16, t: 16, b: 28 };

  const { path, area, pts, yTicks, min, max } = useMemo(() => {
    const rs = data.map((d) => d.r);
    const lo = Math.floor((Math.min(...rs) - 50) / 100) * 100;
    const hi = Math.ceil((Math.max(...rs) + 50) / 100) * 100;
    const t0 = data[0].t;
    const t1 = data[data.length - 1].t || t0 + 1;
    const x = (t: number) => pad.l + ((t - t0) / (t1 - t0 || 1)) * (W - pad.l - pad.r);
    const y = (r: number) => pad.t + (1 - (r - lo) / (hi - lo)) * (H - pad.t - pad.b);
    const pts = data.map((d) => ({ x: x(d.t), y: y(d.r), ...d }));
    const path = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const area = `${path} L${pts[pts.length - 1].x},${H - pad.b} L${pts[0].x},${H - pad.b} Z`;
    const step = (hi - lo) / 4;
    const yTicks = Array.from({ length: 5 }, (_, i) => ({ v: Math.round(lo + i * step), y: y(lo + i * step) }));
    return { path, area, pts, yTicks, min: lo, max: hi };
  }, [data, pad.b, pad.l, pad.r, pad.t]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * W;
    let best = 0;
    pts.forEach((p, i) => Math.abs(p.x - mx) < Math.abs(pts[best].x - mx) && (best = i));
    setIdx(best);
  };

  const cur = idx !== null ? pts[idx] : null;
  const last = pts[pts.length - 1];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none"
        onPointerMove={onMove}
        onPointerLeave={() => setIdx(null)}
        role="img"
        aria-label={`Rating history from ${min} to ${max}`}
      >
        <defs>
          <linearGradient id={`fill-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((t) => (
          <g key={t.v}>
            <line x1={pad.l} x2={W - pad.r} y1={t.y} y2={t.y} stroke="var(--line)" />
            <text x={pad.l - 8} y={t.y + 4} textAnchor="end" fontSize="11" fill="var(--muted)">
              {t.v}
            </text>
          </g>
        ))}
        <path d={area} fill={`url(#fill-${id})`} />
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
        {!cur && <circle cx={last.x} cy={last.y} r="5" fill={color} stroke="var(--bg-soft)" strokeWidth="2" />}
        {!cur && (
          <text x={last.x - 8} y={last.y - 12} textAnchor="end" fontSize="12" fontWeight="700" fill="var(--fg)">
            {last.r}
          </text>
        )}
        {cur && (
          <g>
            <line x1={cur.x} x2={cur.x} y1={pad.t} y2={H - pad.b} stroke="var(--muted)" strokeDasharray="3 3" />
            <circle cx={cur.x} cy={cur.y} r="5" fill={color} stroke="var(--bg-soft)" strokeWidth="2" />
          </g>
        )}
      </svg>
      {cur && (
        <div
          className="glass pointer-events-none absolute top-2 rounded-lg px-3 py-1.5 text-xs"
          style={{ left: `${(cur.x / W) * 100}%`, transform: `translateX(${cur.x > W * 0.7 ? "-110%" : "10%"})` }}
        >
          <div className="font-semibold text-fg">Rating {cur.r}</div>
          <div className="text-muted">{new Date(cur.t).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</div>
        </div>
      )}
    </div>
  );
}

export default function CodingStats() {
  const [s, setS] = useState<Stats>(initial);
  const [tab, setTab] = useState<"leetcode" | "codeforces">("leetcode");

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setS(d))
      .catch(() => {});
  }, []);

  const anyLive = s.live.leetcode || s.live.codeforces || s.live.codechef;
  const history = tab === "leetcode" ? s.leetcode.history : s.codeforces.history;

  const platforms = [
    {
      name: "LeetCode",
      Icon: LeetcodeIcon,
      href: profile.socials.leetcode,
      rating: s.leetcode.rating,
      sub: `Top ${s.leetcode.top}% · ${s.leetcode.contests} contests`,
    },
    {
      name: "CodeChef",
      Icon: CodechefIcon,
      href: profile.socials.codechef,
      rating: s.codechef.rating,
      sub: `${s.codechef.stars}★ · max ${s.codechef.maxRating}`,
    },
    {
      name: "Codeforces",
      Icon: CodeforcesIcon,
      href: profile.socials.codeforces,
      rating: s.codeforces.rating,
      sub: `${s.codeforces.rank[0].toUpperCase() + s.codeforces.rank.slice(1)} · max ${s.codeforces.maxRating}`,
    },
  ];

  return (
    <Section
      id="stats"
      eyebrow="competitive programming"
      title={<>Problem solving, <span className="text-gradient">live</span></>}
      subtitle="1,400+ DSA problems across LeetCode, CodeChef, Codeforces and GeeksforGeeks. These numbers update automatically from each platform."
    >
      <div className="mb-6 flex items-center gap-2 text-xs text-muted">
        <span className={`h-2 w-2 rounded-full ${anyLive ? "bg-emerald-400" : "bg-muted"}`}>
          {anyLive && <span className="block h-2 w-2 animate-ping rounded-full bg-emerald-400" />}
        </span>
        {anyLive ? "Live data" : "Last synced snapshot"}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {platforms.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <a href={p.href} target="_blank" rel="noreferrer" className="glass glow-border group block rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <p.Icon size={22} /> {p.name}
                </span>
                <ArrowUpRight size={18} className="text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
              </div>
              <div className="mt-5 font-display text-5xl font-extrabold">
                <CountUp to={p.rating} />
              </div>
              <div className="mt-1 text-sm text-muted">contest rating · {p.sub}</div>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="glass h-full rounded-3xl p-6">
            <h3 className="mb-6 font-display font-semibold">LeetCode by difficulty</h3>
            <DifficultyRing {...s.leetcode} />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-3">
          <div className="glass h-full rounded-3xl p-6">
            {history.length > 1 || s.codeforces.history.length > 1 ? (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display font-semibold">Rating over time</h3>
                  <div className="flex gap-1 rounded-full border border-line p-1 text-xs">
                    {(["leetcode", "codeforces"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`rounded-full px-3 py-1 transition ${tab === t ? "bg-line text-fg" : "text-muted"}`}
                      >
                        {t === "leetcode" ? "LeetCode" : "Codeforces"}
                      </button>
                    ))}
                  </div>
                </div>
                {history.length > 1 ? (
                  <RatingChart key={tab} id={tab} data={history} color={tab === "leetcode" ? "var(--accent-1)" : "var(--accent-2)"} />
                ) : (
                  <p className="py-16 text-center text-sm text-muted">No rated contests yet on this platform.</p>
                )}
              </>
            ) : (
              <>
                <h3 className="mb-6 font-display font-semibold">Consistency</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { Icon: CalendarDays, v: s.leetcode.activeDays, l: "active days this year" },
                    { Icon: Flame, v: s.leetcode.maxStreak, l: "day max streak" },
                    { Icon: Trophy, v: s.leetcode.contests, l: "LeetCode contests" },
                  ].map(({ Icon, v, l }) => (
                    <div key={l} className="rounded-2xl border border-line p-4">
                      <Icon size={20} className="text-a2" />
                      <div className="mt-3 font-display text-3xl font-extrabold">
                        <CountUp to={v} />
                      </div>
                      <div className="text-xs text-muted">{l}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm text-muted">
                  Consistent daily practice — earned LeetCode&apos;s <span className="text-fg">500 Days badge</span>.
                </p>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
