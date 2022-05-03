const menuBtn = document.getElementById('menu-btn');
const menuText = document.getElementById('menu-text');
let menuOpen = false;
menuBtn.addEventListener('click', () => {
  !menuOpen
    ? (menuText.classList.add('menu-open'), (menuOpen = true))
    : (menuText.classList.remove('menu-open'), (menuOpen = false));
});

menuText.addEventListener('click', () => {
  !menuOpen
    ? (menuText.classList.add('menu-open'), (menuOpen = true))
    : (menuText.classList.remove('menu-open'), (menuOpen = false));
});
