"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { profile } from "@/data/profile";

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "What has Antrika built?",
  "Tell me about her internship",
  "What's her tech stack?",
  "How good is she at DSA?",
  "Is she available to join?",
];

/** Tiny markdown: **bold**, bullet lists and links. */
function Markdown({ text }: { text: string }) {
  const inline = (s: string, k: number) => {
    const parts = s.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g);
    return (
      <span key={k}>
        {parts.map((p, i) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={i} className="text-fg">
              {p.slice(2, -2)}
            </strong>
          ) : /^https?:\/\//.test(p) ? (
            <a key={i} href={p} target="_blank" rel="noreferrer" className="break-all text-a2 underline">
              {p.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          ) : (
            p
          )
        )}
      </span>
    );
  };
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  return (
    <div className="space-y-1.5">
      {lines.map((l, i) =>
        /^\s*[-*•]\s+/.test(l) ? (
          <div key={i} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-a2" />
            {inline(l.replace(/^\s*[-*•]\s+/, ""), i)}
          </div>
        ) : (
          <p key={i}>{inline(l, i)}</p>
        )
      )}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `Hi! I'm ${profile.firstName}'s AI assistant 👋 Ask me anything about her projects, experience, skills or coding stats.`,
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-chat", onOpen);
    return () => window.removeEventListener("open-chat", onOpen);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      if (!res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
      if (!acc) throw new Error();
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: `Sorry, I couldn't answer that right now. You can email Antrika at **${profile.email}**.` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setOpen(true)}
            aria-label="Chat with Antrika's AI assistant"
            className="bg-gradient-brand fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full py-3.5 pl-4 pr-5 font-semibold text-white shadow-2xl shadow-a1/40"
          >
            <span className="bg-gradient-brand absolute inset-0 -z-10 animate-ping rounded-full opacity-30" />
            <Sparkles size={18} /> <span className="hidden sm:inline">Ask my AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed inset-x-3 bottom-3 z-50 flex h-[min(620px,calc(100svh-24px))] flex-col overflow-hidden rounded-3xl border border-line bg-bg-soft/95 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[400px]"
            role="dialog"
            aria-label="AI assistant chat"
          >
            <div className="relative flex items-center gap-3 border-b border-line px-5 py-4">
              <div className="bg-gradient-brand absolute inset-x-0 top-0 h-[2px]" />
              <span className="bg-gradient-brand grid h-10 w-10 place-items-center rounded-full text-white">
                <Bot size={20} />
              </span>
              <div className="flex-1">
                <div className="font-display font-semibold">Ask about {profile.firstName}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Powered by Gemini
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-2 text-muted hover:bg-line hover:text-fg">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user" ? "bg-gradient-brand rounded-br-md text-white" : "rounded-bl-md border border-line bg-bg text-muted"
                    }`}
                  >
                    {m.content ? (
                      m.role === "user" ? m.content : <Markdown text={m.content} />
                    ) : (
                      <span className="flex gap-1 py-1.5">
                        {[0, 1, 2].map((d) => (
                          <motion.span
                            key={d}
                            className="h-1.5 w-1.5 rounded-full bg-a2"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }}
                          />
                        ))}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-a2 hover:text-fg"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-line p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                placeholder="Ask anything about Antrika…"
                className="flex-1 rounded-full border border-line bg-bg px-4 py-2.5 text-sm outline-none focus:border-a1"
              />
              <button
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="bg-gradient-brand grid h-10 w-10 place-items-center rounded-full text-white transition disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
