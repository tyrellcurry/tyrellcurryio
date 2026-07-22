import { postsByNewest } from "./posts";

const renderBlogList = () => {
  const listEl = document.querySelector("#blog_posts");
  if (!listEl) return;

  const posts = postsByNewest();

  if (posts.length === 0) {
    listEl.innerHTML = `<li class="text-lg text-secondary opacity-60">No blog posts yet</li>`;
    return;
  }

  listEl.innerHTML = posts
    .map(
      (post) => `
    <li>
      <a href="/blog/${post.slug}" class="group block">
        <p class="text-xs text-secondary opacity-40 uppercase tracking-wide mb-1">
          ${post.displayDate}
        </p>
        <h2 class="text-lg md:text-xl text-quaternary font-medium group-hover:text-quinary transition-colors duration-100">
          ${post.title}
        </h2>
      </a>
    </li>`
    )
    .join("");
};

document.addEventListener("DOMContentLoaded", renderBlogList);
