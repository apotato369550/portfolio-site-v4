import { useEffect } from 'react';

export function useFadeIn() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.05 }
    );
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
