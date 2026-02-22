const fetchBlogPosts = () => {
  return [];
};

const renderBlogPostLinks = async () => {
  const blogPosts = await fetchBlogPosts();
  const blogPostsEl = document.querySelector("#blog_posts");
  if (blogPosts.length <= 0 && blogPostsEl) {
    blogPostsEl.innerHTML = `<li class="mt-4 text-lg">No blog posts yet</li>`;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  renderBlogPostLinks();
});
