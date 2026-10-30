import { useEffect } from 'react';

export function useFadeIn() {
  useEffect(() => {
    const sections = [...document.querySelectorAll('main > section')];
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.classList.add('visible');
          obs.unobserve(target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    sections.forEach(section => {
      section.classList.add('fade-in');
      obs.observe(section);
    });
    function reveal() {
      if (motion.matches) {
        sections.forEach(section => section.classList.add('visible'));
        obs.disconnect();
      }
    }
    reveal();
    motion.addEventListener('change', reveal);
    return () => {
      obs.disconnect();
      motion.removeEventListener('change', reveal);
      sections.forEach(section => section.classList.remove('fade-in', 'visible'));
    };
  }, []);
}
