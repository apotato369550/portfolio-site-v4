export default function TimetablingDiagram() {
  return (
    <div className="diagram" role="img" aria-label="Constraint satisfaction: variables, domains, constraints fed into two solvers for comparison">
      <div className="diag-section-label">CONSTRAINT SATISFACTION</div>
      <div className="diag-map-row">
        <div className="diag-node">Variables<br /><span>courses</span></div>
        <div className="diag-node">Domains<br /><span>slots · rooms</span></div>
        <div className="diag-node">Constraints<br /><span>no conflicts</span></div>
      </div>
      <div className="diag-arrow">↓ solve</div>
      <div className="diag-map-row">
        <div className="diag-node">Backtracking<br /><span>custom</span></div>
        <div className="diag-node">CP-SAT<br /><span>OR-Tools</span></div>
      </div>
      <div className="diag-arrow">↓ compare on real data</div>
      <div className="diag-result">
        valid schedule<br />
        <span className="diag-note">which wins?</span>
      </div>
    </div>
  );
}
