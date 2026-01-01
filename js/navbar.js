document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('currentUser');

  const menuItems = document.querySelectorAll('.item');
  const loginBtn = document.querySelector('.item.button:not(.secondary) a');
  const signupBtn = document.querySelector('.item.button.secondary a');
  const toggleBtn = document.querySelector('.toggle');
  const logo = document.querySelector('.logo');
  const dashboardLink = document.querySelector(
    '.item:not(.button):not(.logo) a',
  );

  toggleBtn.addEventListener('click', () => {
    menuItems.forEach((item) => {
      item.classList.toggle('active');
    });
  });

  if (user) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '../pages/home.html';
    });

    if (dashboardLink) {
      dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../pages/dashboard.html';
      });
    }

    if (loginBtn) {
      loginBtn.innerText = 'Logout';
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
      });
    }

    if (signupBtn) {
      signupBtn.parentElement.style.display = 'none';
    }
  } else {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '../index.html';
    });

    if (dashboardLink) {
      dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../pages/login.html';
      });
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../pages/login.html';
      });
    }

    if (signupBtn) {
      signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../pages/register.html';
      });
    }
  }

  document.querySelectorAll('.item a').forEach((link) => {
    link.addEventListener('click', () => {
      menuItems.forEach((item) => item.classList.remove('active'));
    });
  });
});
