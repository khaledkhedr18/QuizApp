function startExam() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) {
    alert('Wait a second! Please login first. 🐣');
    window.location.href = '../pages/login.html';
  } else {
    window.location.href = '../pages/startscreen.html';
  }
}

// Animated Counter for Hero Stats
document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('.hero-stat-number');

  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2500; // 2.5 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        const parent = element.parentElement;
        const label = parent.querySelector('.hero-stat-label').textContent;
        if (label.includes('Rate')) {
          element.textContent = target + '%';
        } else {
          element.textContent = target.toLocaleString() + '+';
        }
      }
    };

    updateCounter();
  };

  // Intersection Observer to trigger animation when visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  statNumbers.forEach((stat) => observer.observe(stat));
});
