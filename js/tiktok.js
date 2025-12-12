// Smooth scrolling for internal anchors
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Ripple effect on buttons
document.querySelectorAll('.btn, .nav-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');

        ripple.classList.add('ripple');
        ripple.style.left = `${e.clientX - btn.getBoundingClientRect().left}px`;
        ripple.style.top = `${e.clientY - btn.getBoundingClientRect().top}px`;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});
