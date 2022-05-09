const menuBtn = document.getElementById('menu-btn');
const menuText = document.getElementById('menu-text');
const nav = document.getElementById('nav');
const hamburgerOne = document.querySelector('.hamburger-bottom');
const hamburgerTwo = document.querySelector('.hamburger-middle');
let menuOpen = false;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

menuBtn.addEventListener('click', () => {
  !menuOpen
    ? ((menuText.style.display = 'block'),
      hamburgerOne.classList.add('burger-open'),
      hamburgerTwo.classList.add('burger-open2'),
      nav.classList.add('nav-open'),
      setTimeout(function () {
        menuText.classList.add('menu-open');
      }, 400),
      (menuOpen = true))
    : (menuText.classList.remove('menu-open'),
      hamburgerOne.classList.remove('burger-open'),
      hamburgerTwo.classList.remove('burger-open2'),
      setTimeout(function () {
        menuText.style.display = 'none';
        nav.classList.remove('nav-open');
      }, 200),
      (menuOpen = false));
});

menuText.addEventListener('click', () => {
  !menuOpen
    ? (menuText.classList.add('menu-open'), (menuOpen = true))
    : (menuText.classList.remove('menu-open'),
      nav.classList.remove('nav-open'),
      hamburgerOne.classList.remove('burger-open'),
      hamburgerTwo.classList.remove('burger-open2'),
      (menuOpen = false));
});
