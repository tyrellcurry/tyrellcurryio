import { renderPost } from "./post";

const slug = window.location.pathname.split("/").filter(Boolean).pop() ?? "";

document.addEventListener("DOMContentLoaded", () => {
  renderPost(slug, "post-content");
});
