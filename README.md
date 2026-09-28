# Antrika Kashyap — Portfolio

A dark, futuristic portfolio built with **Next.js 16 + Tailwind CSS 4**, featuring:

- 🌌 **3D particle galaxy** hero (three.js) that tilts toward your mouse
- 🤖 **"Ask my AI" chatbot** powered by Google Gemini, trained on your resume
- 📊 **Live coding stats** from LeetCode, Codeforces and CodeChef (refreshes every 6 hours)
- ✨ Scroll animations, 3D tilt cards, typewriter roles, project filters (Framer Motion)
- 🌗 Light / dark theme toggle (dark by default)
- 📄 Resume download + 📬 contact form

---

## 1. Run it on your computer

You need **Node.js 20+** installed ([nodejs.org](https://nodejs.org)).

```bash
cd portfolio
npm install          # downloads the libraries (only once)
cp .env.example .env.local
npm run dev          # open http://localhost:3000
```

## 2. Turn on the AI chatbot (free)

1. Go to **https://aistudio.google.com/apikey** and click *Create API key*.
2. Paste it in `.env.local`:  `GEMINI_API_KEY=your-key-here`
3. Restart `npm run dev`.

No key? The chatbot still answers basic questions with built-in replies.

## 3. Turn on the contact form (free)

1. Sign up at **https://formspree.io** and create a form.
2. Copy the ID from the form URL (`https://formspree.io/f/`**`abcdwxyz`**).
3. Add it to `.env.local`:  `NEXT_PUBLIC_FORMSPREE_ID=abcdwxyz`

No ID? The form opens the visitor's email app instead.

## 4. Put it online with Vercel (free)

1. Create a new GitHub repo (e.g. `portfolio`) and push this folder:
   ```bash
   git init && git add . && git commit -m "My portfolio"
   git branch -M main
   git remote add origin https://github.com/antrika02/portfolio.git
   git push -u origin main
   ```
2. Go to **https://vercel.com**, sign in with GitHub → *Add New Project* → pick the repo.
3. In **Environment Variables**, add `GEMINI_API_KEY` and `NEXT_PUBLIC_FORMSPREE_ID`.
4. Click **Deploy**. You get a link like `antrika-kashyap.vercel.app` 🎉

> Live stats: the stats section shows your saved numbers until it's deployed, then pulls
> fresh numbers from each site. If a site ever blocks the request, the saved numbers show instead.

---

## ✏️ How to edit your content

**Everything is in one file: `src/data/profile.ts`.** Change the text there and the whole site updates.

| I want to…                   | Edit this in `profile.ts`                        |
| ---------------------------- | ------------------------------------------------ |
| Add my photo                 | Put `me.jpg` in `/public`, set `photo: "/me.jpg"` |
| Add / change a project       | the `projects` list                              |
| Add a live demo link         | add `live: "https://..."` to that project        |
| Change skills                | the `skills` list                                |
| Add a new job / internship   | the `experience` list                            |
| Update fallback coding stats | `fallbackStats`                                  |

To replace the resume, overwrite `public/Antrika_Kashyap_Resume.pdf` (keep the same name).

## 📁 Project map

```
src/
  app/
    page.tsx            ← puts all sections in order
    layout.tsx          ← fonts, page title, SEO
    globals.css         ← colours for dark + light theme
    api/chat/route.ts   ← Gemini chatbot backend
    api/stats/route.ts  ← live LeetCode / Codeforces / CodeChef stats
  components/
    Hero.tsx, ParticleHero.tsx, Navbar.tsx, Sections.tsx,
    CodingStats.tsx, ChatWidget.tsx, ui.tsx, BrandIcons.tsx
  data/profile.ts       ← ⭐ ALL YOUR CONTENT
```
