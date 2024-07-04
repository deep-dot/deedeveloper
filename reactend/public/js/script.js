// public/toggleTheme.js
function handleDarkModeToggle() {
  const mainWrapper = document.querySelector('.main-wrapper');
  const lightLogo = document.getElementById('light-logo');
  const darkLogo = document.getElementById('dark-logo');
  const footerLightLogo = document.getElementById('footer-light-logo');
  const footerDarkLogo = document.getElementById('footer-dark-logo');
  const darkMode = mainWrapper.classList.contains('dark');

  if (darkMode) {
    mainWrapper.classList.remove('dark');
    mainWrapper.classList.add('light');
    if (lightLogo) lightLogo.style.display = 'block';
    if (darkLogo) darkLogo.style.display = 'none';
    if (footerLightLogo) footerLightLogo.style.display = 'none';
    if (footerDarkLogo) footerDarkLogo.style.display = 'block';
  } else {
    mainWrapper.classList.remove('light');
    mainWrapper.classList.add('dark');
    if (lightLogo) lightLogo.style.display = 'none';
    if (darkLogo) darkLogo.style.display = 'block';
    if (footerLightLogo) footerLightLogo.style.display = 'block';
    if (footerDarkLogo) footerDarkLogo.style.display = 'none';
  }
}

window.handleDarkModeToggle = handleDarkModeToggle;
