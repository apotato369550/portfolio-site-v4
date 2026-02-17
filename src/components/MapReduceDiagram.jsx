export default function MapReduceDiagram() {
  return (
    <div
      className="diagram"
      role="img"
      aria-label="Map-reduce architecture: 5 images analyzed in parallel, results combined into one verdict"
    >
      <div className="diag-section-label">MAP — parallel</div>
      <div className="diag-map-row">
        <div className="diag-node">img₁<br /><span>→ AI</span></div>
        <div className="diag-node">img₂<br /><span>→ AI</span></div>
        <div className="diag-node">img₃<br /><span>→ AI</span></div>
        <div className="diag-node">img₄<br /><span>→ AI</span></div>
        <div className="diag-node">img₅<br /><span>→ AI</span></div>
      </div>
      <div className="diag-arrow">↓</div>
      <div className="diag-section-label">REDUCE — synthesize</div>
      <div className="diag-reduce-row">
        <div className="diag-node diag-node--wide">GPT-4 reads all 5 → one verdict</div>
      </div>
      <div className="diag-arrow">↓</div>
      <div className="diag-result">
        Complete listing analysis<br />
        <span className="diag-note">4 min → 90 sec</span>
      </div>
    </div>
  );
}
