import arkad from '../assets/arkad-logo.png';
import arkadIcon from '../assets/arkad-icon.png';
import enrollmate from '../assets/enrollmate.svg';
import cbvt from '../assets/cbvt.png';
import python from '../assets/python.svg';
import openai from '../assets/openai.svg';

export default function ProjectVisual({ title }) {
  if (title === 'AI Analysis & Generation API') return <div className="project-visual visual-ai"><div className="ai-marks"><div><img src={python} alt="Python" /></div><span className="visual-plus">+</span><div><img src={openai} alt="OpenAI" /></div></div></div>;
  if (title === 'arkad') return <div className="project-visual visual-arkad"><img className="arkad-wordmark" src={arkad} alt="Arkad" /><div className="brand-phone"><div className="phone-speaker" /><img src={arkadIcon} alt="Arkad app icon" /></div></div>;
  if (title === 'enrollmate') return <div className="project-visual visual-enrollmate"><span className="project-wordmark project-wordmark--enrollmate">ENROLLMATE</span><div className="schedule-motif" aria-hidden="true">{Array.from({length:15},(_,i)=><span key={i} />)}</div><div className="brand-monitor"><div className="monitor-screen"><img src={enrollmate} alt="Enrollmate logo" /></div><div className="monitor-stand" /></div></div>;
  if (title === 'cbvt') return <div className="project-visual visual-cbvt"><span className="project-wordmark project-wordmark--cbvt">CBVT</span><img className="cbvt-mark" src={cbvt} alt="Cebu Best Value Trading" /><svg viewBox="0 0 200 260" role="img" aria-label="Split, window, and floor-standing air conditioners" fill="white" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
      <rect x="12" y="12" width="176" height="52" rx="9" />
      <path d="M25 46h150M25 54h150M161 26h12" fill="none" />
      <rect x="12" y="100" width="100" height="93" rx="3" />
      <path d="M25 116h50M25 126h50M25 136h50M25 146h50M25 156h50M25 166h50M87 114v64" fill="none" />
      <circle cx="99" cy="124" r="3" fill="#A85A1A" stroke="none" />
      <rect x="133" y="91" width="55" height="151" rx="5" />
      <path d="M142 107h37M142 115h37M142 123h37M142 131h37M142 139h37M142 224h37" fill="none" />
      <path d="M47 73v12M88 73v12M130 73v12M34 202v18M63 202v18M92 202v18" stroke="#A85A1A" strokeLinecap="round" />
      <circle cx="160" cy="161" r="4" fill="#A85A1A" stroke="none" />
    </svg></div>;
  return null;
}
