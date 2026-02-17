export default function KitchenDiagram() {
  return (
    <div className="diagram" role="img" aria-label="Data flow: input through processing to storage and output">
      <div className="diag-section-label">DATA FLOW</div>
      <div className="diag-map-row">
        <div className="diag-node">Orders<br /><span>input</span></div>
        <div className="diag-node">Inventory<br /><span>input</span></div>
      </div>
      <div className="diag-arrow">↓ process</div>
      <div className="diag-reduce-row">
        <div className="diag-node diag-node--wide">Django + PostgreSQL</div>
      </div>
      <div className="diag-arrow">↓ output</div>
      <div className="diag-map-row">
        <div className="diag-node">Excel<br /><span>export</span></div>
        <div className="diag-node">PDF<br /><span>export</span></div>
      </div>
      <div className="diag-result" style={{marginTop: '10px'}}>
        <span className="diag-note">replaced paper tracking</span>
      </div>
    </div>
  );
}
