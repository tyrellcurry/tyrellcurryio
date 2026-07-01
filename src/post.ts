import { marked } from "marked";

export async function renderPost(slug: string, containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const res = await fetch(`/posts/${slug}.md`);
  if (!res.ok) {
    container.innerHTML = `<p class="text-secondary opacity-60">Post not found.</p>`;
    return;
  }

  const md = await res.text();
  container.innerHTML = await marked(md);
}
