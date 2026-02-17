export default function EnrollmateDiagram() {
  return (
    <div className="diagram" role="img" aria-label="Backtracking search: branch, detect conflict, prune, find valid schedules">
      <div className="diag-section-label">BACKTRACKING SEARCH</div>
      <div className="diag-reduce-row">
        <div className="diag-node">selected courses</div>
      </div>
      <div className="diag-arrow">↓ branch</div>
      <div className="diag-map-row">
        <div className="diag-node">combo A+B<br /><span>conflict ✗</span></div>
        <div className="diag-node">combo A+C<br /><span>continue →</span></div>
      </div>
      <div className="diag-arrow">↓ branch again</div>
      <div className="diag-map-row">
        <div className="diag-node">+ D<br /><span>valid ✓</span></div>
        <div className="diag-node">+ E<br /><span>conflict ✗</span></div>
      </div>
      <div className="diag-result" style={{marginTop: '10px'}}>
        every conflict-free schedule<br />
        <span className="diag-note">no manual checking</span>
      </div>
    </div>
  );
}
