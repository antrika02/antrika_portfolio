import { fallbackStats, profile } from "@/data/profile";

// Live coding stats from LeetCode, Codeforces and CodeChef.
// Results are cached for 6 hours so we don't hammer the sites.
const SIX_HOURS = 60 * 60 * 6;

type Point = { t: number; r: number };

async function leetcode() {
  const query = `query($u:String!){
    matchedUser(username:$u){
      submitStatsGlobal{ acSubmissionNum{ difficulty count } }
      userCalendar{ streak totalActiveDays }
    }
    userContestRanking(username:$u){ rating topPercentage attendedContestsCount }
    userContestRankingHistory(username:$u){ attended rating contest{ startTime } }
  }`;
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
    body: JSON.stringify({ query, variables: { u: profile.handles.leetcode } }),
    next: { revalidate: SIX_HOURS },
  });
  if (!res.ok) throw new Error("leetcode");
  const { data } = await res.json();
  const ac: { difficulty: string; count: number }[] = data.matchedUser.submitStatsGlobal.acSubmissionNum;
  const get = (d: string) => ac.find((x) => x.difficulty === d)?.count ?? 0;
  const history: Point[] = (data.userContestRankingHistory ?? [])
    .filter((h: { attended: boolean }) => h.attended)
    .map((h: { rating: number; contest: { startTime: number } }) => ({ t: h.contest.startTime * 1000, r: Math.round(h.rating) }));

  return {
    solved: get("All"),
    easy: get("Easy"),
    medium: get("Medium"),
    hard: get("Hard"),
    rating: Math.round(data.userContestRanking?.rating ?? fallbackStats.leetcode.rating),
    top: data.userContestRanking?.topPercentage ?? fallbackStats.leetcode.top,
    contests: data.userContestRanking?.attendedContestsCount ?? fallbackStats.leetcode.contests,
    activeDays: data.matchedUser.userCalendar?.totalActiveDays ?? fallbackStats.leetcode.activeDays,
    maxStreak: data.matchedUser.userCalendar?.streak ?? fallbackStats.leetcode.maxStreak,
    history,
  };
}

async function codeforces() {
  const h = profile.handles.codeforces;
  const [info, rating] = await Promise.all([
    fetch(`https://codeforces.com/api/user.info?handles=${h}`, { next: { revalidate: SIX_HOURS } }).then((r) => r.json()),
    fetch(`https://codeforces.com/api/user.rating?handle=${h}`, { next: { revalidate: SIX_HOURS } }).then((r) => r.json()),
  ]);
  if (info.status !== "OK") throw new Error("codeforces");
  const u = info.result[0];
  return {
    rating: u.rating ?? fallbackStats.codeforces.rating,
    maxRating: u.maxRating ?? fallbackStats.codeforces.maxRating,
    rank: u.rank ?? fallbackStats.codeforces.rank,
    history: (rating.result ?? []).map((c: { ratingUpdateTimeSeconds: number; newRating: number }) => ({
      t: c.ratingUpdateTimeSeconds * 1000,
      r: c.newRating,
    })) as Point[],
  };
}

async function codechef() {
  // CodeChef has no public API, so we read the numbers from the profile page.
  const res = await fetch(`https://www.codechef.com/users/${profile.handles.codechef}`, {
    headers: { "User-Agent": "Mozilla/5.0 portfolio-stats" },
    next: { revalidate: SIX_HOURS },
  });
  if (!res.ok) throw new Error("codechef");
  const html = await res.text();
  const rating = Number(html.match(/class="rating-number">\s*(\d+)/)?.[1]);
  const max = Number(html.match(/Highest Rating\s*(\d+)/)?.[1]);
  const stars = Number(html.match(/(\d)★/)?.[1]);
  if (!rating) throw new Error("codechef parse");
  return {
    rating,
    maxRating: max || rating,
    stars: stars || fallbackStats.codechef.stars,
    globalRank: fallbackStats.codechef.globalRank,
  };
}

export async function GET() {
  const [lc, cf, cc] = await Promise.allSettled([leetcode(), codeforces(), codechef()]);

  return Response.json(
    {
      leetcode: lc.status === "fulfilled" ? lc.value : { ...fallbackStats.leetcode, history: [] },
      codeforces: cf.status === "fulfilled" ? cf.value : { ...fallbackStats.codeforces, history: [] },
      codechef: cc.status === "fulfilled" ? cc.value : fallbackStats.codechef,
      live: {
        leetcode: lc.status === "fulfilled",
        codeforces: cf.status === "fulfilled",
        codechef: cc.status === "fulfilled",
      },
      updatedAt: new Date().toISOString(),
    },
    { headers: { "Cache-Control": `public, s-maxage=${SIX_HOURS}, stale-while-revalidate=86400` } }
  );
}
