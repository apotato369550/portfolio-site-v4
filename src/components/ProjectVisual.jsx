import arkad from '../assets/arkad-logo.png';
import arkadIcon from '../assets/arkad-icon.png';
import enrollmate from '../assets/enrollmate.svg';
import cbvt from '../assets/cbvt.png';
import python from '../assets/python.svg';
import openai from '../assets/openai.svg';

export default function ProjectVisual({ title }) {
  if (title === 'Customer Churn Analysis') return (
    <div className="project-visual visual-churn">
      <svg className="analysis-art" viewBox="0 0 360 230" role="img" aria-label="Conceptual classification grid highlighting missed churn cases, not measured counts">
        <text x="15" y="133" textAnchor="middle" transform="rotate(-90 15 133)">ACTUAL</text>
        <text x="204" y="20" textAnchor="middle">PREDICTED</text>
        <text x="147" y="43" textAnchor="middle">Stay</text><text x="261" y="43" textAnchor="middle">Leave</text>
        <text x="58" y="100" textAnchor="end">Stay</text><text x="58" y="181" textAnchor="end">Leave</text>
        <rect x="77" y="55" width="130" height="72" rx="10" fill="#b8d8d6" />
        <rect x="215" y="55" width="130" height="72" rx="10" fill="#e0e8ee" />
        <rect x="77" y="135" width="130" height="72" rx="10" fill="#f4b497" />
        <rect x="215" y="135" width="130" height="72" rx="10" fill="#e0e8ee" />
        {[0, 1, 2].map(row => Array.from({ length: 7 }, (_, col) => <circle key={`${row}-${col}`} cx={96 + col * 15} cy={73 + row * 18} r="4" fill="#326568" />))}
        <path d="m132 160 18 18m0-18-18 18" stroke="#833e2d" strokeWidth="3" strokeLinecap="round" />
        <text x="280" y="178" textAnchor="middle">?</text>
        <path d="M142 210v12h70" fill="none" stroke="#833e2d" />
        <text x="220" y="226">Missed churn</text>
      </svg>
    </div>
  );
  if (title === 'Hypothesis Testing in Healthcare') return (
    <div className="project-visual visual-healthcare">
      <svg className="analysis-art" viewBox="18 35 324 195" role="img" aria-label="Conceptual overlapping treatment and placebo distributions, not actual study results">
        <g stroke="#d2dfdd" strokeWidth="1"><path d="M28 55h304M28 95h304M28 135h304M28 175h304" /></g>
        <path d="M28 185C65 185 71 164 96 112S132 48 151 48s38 28 58 77 31 60 123 60" fill="#518b8940" stroke="#397775" strokeWidth="3" />
        <path d="M28 185c74 0 76-25 103-75s37-55 55-55 38 30 57 75 39 55 89 55" fill="#a392c440" stroke="#8772a7" strokeWidth="3" strokeDasharray="6 5" />
        <path d="M28 195h304" stroke="#65817e" />
        <text x="28" y="219">Treatment</text><path d="M108 215h30" stroke="#397775" strokeWidth="3" />
        <text x="214" y="219">Placebo</text><path d="M281 215h30" stroke="#8772a7" strokeWidth="3" strokeDasharray="6 5" />
      </svg>
    </div>
  );
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
