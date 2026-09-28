import { achievements, certifications, education, experience, fallbackStats, profile, projects, skills } from "@/data/profile";

// "Ask about Antrika" chatbot powered by Google Gemini.
// Set GEMINI_API_KEY in .env.local (and in Vercel → Settings → Environment Variables).

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function knowledge() {
  return [
    `NAME: ${profile.name}`,
    `LOCATION: ${profile.location}. Available to join immediately.`,
    `EMAIL: ${profile.email}`,
    `LINKS: GitHub ${profile.socials.github} | LinkedIn ${profile.socials.linkedin} | LeetCode ${profile.socials.leetcode}`,
    `SUMMARY: ${profile.about.join(" ")}`,
    `EDUCATION: ${education.map((e) => `${e.degree}, ${e.school} (${e.period}), ${e.detail}`).join("; ")}`,
    `EXPERIENCE: ${experience
      .map((e) => `${e.role} at ${e.company} (${e.period}, ${e.place}): ${e.points.join(" ")}`)
      .join("\n")}`,
    `SKILLS: ${skills.map((s) => `${s.title}: ${s.items.join(", ")}`).join(" | ")}`,
    `PROJECTS:\n${projects
      .map((p) => `- ${p.title} [${p.category}] — ${p.blurb} ${p.highlights.join("; ")}. Stack: ${p.stack.join(", ")}. Code: ${p.github}`)
      .join("\n")}`,
    `COMPETITIVE PROGRAMMING: 1,400+ problems solved overall. LeetCode ${fallbackStats.leetcode.solved} solved (${fallbackStats.leetcode.easy} easy / ${fallbackStats.leetcode.medium} medium / ${fallbackStats.leetcode.hard} hard), contest rating ${fallbackStats.leetcode.rating} (top ${fallbackStats.leetcode.top}%). CodeChef ${fallbackStats.codechef.stars}★ (rating ${fallbackStats.codechef.rating}). Codeforces ${fallbackStats.codeforces.rank} (max ${fallbackStats.codeforces.maxRating}).`,
    `ACHIEVEMENTS: ${achievements.map((a) => `${a.title} (${a.detail})`).join("; ")}`,
    `CERTIFICATIONS: ${certifications.join("; ")}`,
  ].join("\n");
}

const SYSTEM = `You are the friendly AI assistant on ${profile.name}'s portfolio website. Visitors are mostly recruiters and engineers.

RULES
- Answer ONLY using the facts below. If something isn't covered, say you don't know and suggest emailing ${profile.email}.
- Never invent numbers, companies, dates or links.
- Refer to her as "Antrika" (she/her). Be warm, confident and concise: 2–5 short sentences or a tight bullet list.
- When useful, point to a section of the site (Projects, Experience, Coding stats, Contact) or a GitHub link.
- If asked something unrelated to Antrika (e.g. general coding help), politely steer back.
- Use light markdown (**bold**, bullet lists). No headings.

FACTS
${knowledge()}`;

type Msg = { role: "user" | "assistant"; content: string };

// Simple answer engine used when no API key is configured yet.
function offlineAnswer(q: string) {
  const s = q.toLowerCase();
  if (/project|built|build|portfolio|work on/.test(s))
    return `Antrika has built ${projects.length} projects, including **${projects[0].title}** (${projects[0].blurb.split("—")[0].trim()}), **${projects[1].title}** and **${projects[3].title}**. Scroll to the Projects section for details and GitHub links!`;
  if (/experience|intern|job|work|bluestock/.test(s))
    return `She was a **${experience[0].role}** at **${experience[0].company}** (${experience[0].period}). Highlights: cut deployment time from 45 to 5 minutes, cut query latency by 38%, and fixed 15+ production incidents.`;
  if (/skill|stack|tech|language|know/.test(s))
    return `Her core stack: **Java, Python, SQL**, Spring Boot and FastAPI on the backend, PostgreSQL/MySQL/Redis, Docker + GitHub Actions, and GenAI tools like RAG, LangGraph and the Gemini/Claude APIs.`;
  if (/leetcode|codeforces|codechef|dsa|competitive|rating|problem/.test(s))
    return `She has solved **1,400+ DSA problems**. LeetCode contest rating **${fallbackStats.leetcode.rating}** (top ${fallbackStats.leetcode.top}%), CodeChef **${fallbackStats.codechef.stars}★**, Codeforces **${fallbackStats.codeforces.rank}**.`;
  if (/educat|college|degree|cgpa|vit|study/.test(s))
    return `She did her **B.Tech in CSE at VIT Bhopal** (2022–2026) with a **CGPA of 8.4/10**.`;
  if (/contact|email|hire|reach|available|join/.test(s))
    return `Antrika is open to SDE, Backend and AI roles and can join immediately. Email her at **${profile.email}** or use the contact form below.`;
  return `I can tell you about Antrika's **projects, experience, skills, coding stats or education** — what would you like to know?`;
}

function textStream(text: string) {
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

export async function POST(req: Request) {
  let messages: Msg[] = [];
  try {
    ({ messages } = await req.json());
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // basic abuse guards
  messages = (messages ?? []).slice(-10).map((m) => ({ role: m.role, content: String(m.content).slice(0, 800) }));
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return new Response("Bad request", { status: 400 });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return textStream(offlineAnswer(lastUser.content));

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
        generationConfig: { temperature: 0.5, maxOutputTokens: 600, thinkingConfig: { thinkingBudget: 0 } },
      }),
    }
  );

  if (!upstream.ok || !upstream.body) {
    console.error("Gemini error", upstream.status, await upstream.text().catch(() => ""));
    return textStream(offlineAnswer(lastUser.content));
  }

  // Turn Gemini's SSE stream into a plain text stream for the browser.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          try {
            const json = JSON.parse(line.slice(5));
            const text = json.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            /* ignore partial lines */
          }
        }
      },
    })
  );

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
