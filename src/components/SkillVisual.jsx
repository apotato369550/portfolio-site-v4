import { skillCertificates } from '../data/content';
import awsPdf from '../assets/aws_cloud_practitioner_essentials.pdf';
const assets = import.meta.glob('../assets/*.svg', { eager: true, query: '?url', import: 'default' });
const brands = {
  ai: [['openai', 'OpenAI'], ['claude', 'Claude'], ['qdrant', 'Qdrant']],
  backend: [['python', 'Python'], ['supabase', 'Supabase']],
  linux: [['ubuntu', 'Ubuntu'], ['linuxmint', 'Linux Mint'], ['minecraft', 'Minecraft']],
};
function Logo({ name, label }) {
  if (!assets[`../assets/${name}.svg`]) return <span className="skill-brand-fallback">{label}</span>;
  return <img className={`skill-brand skill-brand--${name}`} src={assets[`../assets/${name}.svg`]} alt={label} />;
}
export default function SkillVisual({ group }) {
  if (group.visual === 'certificates') return <div className="certificate-fan">{skillCertificates.map(cert => <a className="skill-certificate datacamp-certificate" href={cert.href} key={cert.title} target="_blank" rel="noopener noreferrer" aria-label={`View ${cert.title} certificate (opens in new tab)`}><div className="certificate-stripe" aria-hidden="true">⌁</div><div className="certificate-copy"><span>STATEMENT OF ACCOMPLISHMENT</span><small>AWARDED TO</small><b>John Andre Yap</b><strong>{cert.title}</strong><span className="certificate-provider">datacamp</span></div></a>)}</div>;
  if (group.visual === 'aws') return <div className="skill-cloud"><Logo name="amazonwebservices" label="AWS" /><a className="skill-certificate aws-certificate" href={awsPdf} target="_blank" rel="noopener noreferrer" aria-label="View AWS Cloud Practitioner Essentials completion certificate PDF (opens in new tab)"><b>AWS Training &amp; Certification</b><span>Completion Certificate</span><strong>AWS Cloud Practitioner Essentials</strong><small>Completed: September 13, 2026</small><span>Awarded to<br />John Andre Yap</span><b className="aws-sign">aws ⤻</b></a></div>;
  return <div className={`skill-icon-fan skill-icon-fan--${group.id}`}>{brands[group.id]?.map(([name,label]) => <div key={name} className={`skill-icon-tile skill-icon-tile--${name}`}><Logo name={name} label={label} /></div>)}{group.id === 'backend' && <div className="skill-icon-tile skill-icon-tile--api"><svg className="skill-brand" viewBox="0 0 100 100" role="img" aria-label="API connected endpoints" fill="none" stroke="#375b79" strokeWidth="5"><path d="M28 25h23v50H28M51 50h22"/><rect x="8" y="14" width="20" height="22" rx="4"/><rect x="8" y="64" width="20" height="22" rx="4"/><rect x="73" y="39" width="20" height="22" rx="4"/></svg></div>}</div>;
}
