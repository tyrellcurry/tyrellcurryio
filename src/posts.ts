export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "free-full-stack-hosting",
    title: "Hosting a Full-Stack App for Free on Vercel and My Raspberry Pi",
    date: "2026-08-08",
    displayDate: "August 8th, 2026",
  },
  {
    slug: "patching-urxvt-for-emoji",
    title: "Patching urxvt to Render Color Emoji",
    date: "2026-07-21",
    displayDate: "July 21st, 2026",
  },
  {
    slug: "raspberry-pi-server",
    title: "I Built a Web Server on my Raspberry Pi 5",
    date: "2026-06-30",
    displayDate: "June 30th, 2026",
  },
];

export const postsByNewest = (): BlogPost[] =>
  [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));

export const latestPosts = (n: number): BlogPost[] =>
  postsByNewest().slice(0, n);
