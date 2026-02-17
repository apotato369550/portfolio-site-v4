import { useFadeIn } from './hooks/useFadeIn';
import Header from './components/Header';
import Profile from './components/Profile';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Affiliations from './components/Affiliations';
import Scholarships from './components/Scholarships';
import Education from './components/Education';
import Footer from './components/Footer';

export default function App() {
  useFadeIn();
  return (
    <div className="page">
      <Header />
      <main>
        <Profile />
        <Experience />
        <Projects />
        <Skills />
        <Affiliations />
        <Scholarships />
        <Education />
      </main>
      <Footer />
    </div>
  );
}
