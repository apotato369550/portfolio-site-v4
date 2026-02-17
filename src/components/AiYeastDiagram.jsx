export default function AiYeastDiagram() {
  return (
    <div className="diagram" role="img" aria-label="Three-layer memory architecture: episodic, semantic, core identity">
      <div className="diag-section-label">MEMORY LAYERS</div>
      <div className="diag-reduce-row">
        <div className="diag-node diag-node--wide">Episodic<br /><span>recent events</span></div>
      </div>
      <div className="diag-arrow">↓ decay</div>
      <div className="diag-reduce-row">
        <div className="diag-node diag-node--wide">Semantic<br /><span>distilled facts</span></div>
      </div>
      <div className="diag-arrow">↓ reinforce on recall</div>
      <div className="diag-reduce-row">
        <div className="diag-node diag-node--wide">Core Identity<br /><span>stable self</span></div>
      </div>
      <div className="diag-result" style={{marginTop: '10px'}}>
        <span className="diag-note">persists across sessions</span>
      </div>
    </div>
  );
}
