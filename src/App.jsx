import { useFadeIn } from './hooks/useFadeIn';
import LandscapeBackground from './components/LandscapeBackground';
import Header from './components/Header';
import Profile from './components/Profile';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Scholarships from './components/Scholarships';
import Education from './components/Education';
import Footer from './components/Footer';
import Contact from './components/Contact';

export default function App() {
  useFadeIn();
  return (
    <>
      <LandscapeBackground />
      <div className="page">
        <Header />
        <main>
          <Profile />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <Scholarships />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
