import { renderTrafficChart, renderUptimeBadge } from "./charts";

const BLOG_POSTS = [
  {
    slug: "raspberry-pi-server",
    title: "I Built a Web Server on my Raspberry Pi 5",
    date: "June 30th, 2026",
  },
];

const renderBlogPostLinks = () => {
  const blogPostsEl = document.querySelector("#blog_posts");
  if (!blogPostsEl) return;

  if (BLOG_POSTS.length === 0) {
    blogPostsEl.innerHTML = `<li class="mt-4 text-lg">No blog posts yet</li>`;
    return;
  }

  blogPostsEl.innerHTML = BLOG_POSTS.map(
    (post) => `
    <li class="mt-3">
      <a href="/blog/${post.slug}" class="text-quaternary hover:text-quinary transition-colors duration-100">
        ${post.title}
      </a>
      <span class="text-xs opacity-40 ml-2">${post.date}</span>
    </li>`
  ).join("");
};

document.addEventListener("DOMContentLoaded", () => {
  renderBlogPostLinks();
  renderTrafficChart();
  renderUptimeBadge();
});
