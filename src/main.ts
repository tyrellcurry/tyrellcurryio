import { renderTrafficChart, renderUptimeBadge } from "./charts";
import { latestPosts } from "./posts";

const HOMEPAGE_POST_COUNT = 3;

const renderBlogPostLinks = () => {
  const blogPostsEl = document.querySelector("#blog_posts");
  if (!blogPostsEl) return;

  const posts = latestPosts(HOMEPAGE_POST_COUNT);

  if (posts.length === 0) {
    blogPostsEl.innerHTML = `<li class="mt-4 text-lg">No blog posts yet</li>`;
    return;
  }

  blogPostsEl.innerHTML = posts
    .map(
      (post) => `
    <li class="mt-3">
      <a href="/blog/${post.slug}" class="text-quaternary hover:text-quinary transition-colors duration-100">
        ${post.title}
      </a>
      <span class="text-xs opacity-40 ml-2">${post.displayDate}</span>
    </li>`,
    )
    .join("");
};

document.addEventListener("DOMContentLoaded", () => {
  renderBlogPostLinks();
  renderTrafficChart();
  renderUptimeBadge();
});
