import { useEffect } from 'react';
import { useFadeIn } from './hooks/useFadeIn';
import Header from './components/Header';
import Profile from './components/Profile';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Footer from './components/Footer';

export default function App() {
  useFadeIn();

  // Tooltip touch support
  useEffect(() => {
    if (!('ontouchstart' in window)) return;
    const openTip = el => {
      const was = el.classList.contains('tip-open');
      document.querySelectorAll('[data-tip].tip-open').forEach(t => t.classList.remove('tip-open'));
      if (!was) el.classList.add('tip-open');
    };
    const closeTips = () =>
      document.querySelectorAll('[data-tip].tip-open').forEach(t => t.classList.remove('tip-open'));
    document.querySelectorAll('[data-tip]').forEach(el =>
      el.addEventListener('click', e => { e.stopPropagation(); openTip(el); })
    );
    document.addEventListener('click', closeTips);
    return () => document.removeEventListener('click', closeTips);
  }, []);

  return (
    <div className="page">
      <Header />
      <Profile />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Footer />
    </div>
  );
}
