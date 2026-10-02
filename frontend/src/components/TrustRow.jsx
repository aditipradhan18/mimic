export function TrustRow() {
  const domains = [
    { title: "Software Engineering", code: "DEBUG · ARCH · CODEBASE" },
    { title: "Technical Operations", code: "INFRA · INCIDENT · RUNBOOK" },
    { title: "Enterprise Training", code: "ONBOARD · STANDARD · SOP" },
    { title: "Industrial Workflows", code: "CAD · SIMULATION · QA" },
  ];

  return (
    <section className="trust-row-section">
      <div className="trust-row-inner">
        <span className="trust-row-heading">
          BUILT FOR THE MOMENTS EXPERTS DON'T DOCUMENT
        </span>

        <div className="trust-badges-grid">
          {domains.map((d, i) => (
            <div key={i} className="trust-domain-card">
              <span className="domain-index">0{i + 1}</span>
              <span className="domain-title">{d.title}</span>
              <span className="domain-code">{d.code}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustRow;
