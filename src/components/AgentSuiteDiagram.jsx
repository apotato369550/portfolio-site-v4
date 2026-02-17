export default function AgentSuiteDiagram() {
  return (
    <div className="diagram" role="img" aria-label="Agent pipeline: human sets intent and scope, agent executes, output returned to human">
      <div className="diag-section-label">AGENT PIPELINE</div>
      <div className="diag-reduce-row">
        <div className="diag-node diag-node--wide">Human<br /><span>sets intent</span></div>
      </div>
      <div className="diag-arrow">↓ explicit scope</div>
      <div className="diag-reduce-row">
        <div className="diag-node diag-node--wide">Agent<br /><span>executes within limits</span></div>
      </div>
      <div className="diag-arrow">↓ report</div>
      <div className="diag-reduce-row">
        <div className="diag-node diag-node--wide">Human reviews<br /><span>decides next</span></div>
      </div>
      <div className="diag-result" style={{marginTop: '10px'}}>
        <span className="diag-note">no inter-agent communication</span>
      </div>
    </div>
  );
}
