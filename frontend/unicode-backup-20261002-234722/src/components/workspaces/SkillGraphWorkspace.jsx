import { useState } from "react";

const DEMO_GRAPH_NODES = [
  {
    id: "n1",
    step: "01",
    label: "Open auth.py",
    type: "ACTION",
    criticality: "Standard",
    status: "Verified",
    description: "Initial codebase navigation to the authentication controller.",
    evidence: "Editor buffer set to src/auth.py at +1.8s relative timestamp.",
    dependencies: "None (Entry Trigger)",
  },
  {
    id: "n2",
    step: "02",
    label: "Check config.py",
    type: "CRITICAL SIGNAL",
    criticality: "Critical",
    status: "Candidate",
    description: "Tacit verification check: expert checked environment variable resolution before editing validator code.",
    evidence: "4.2s viewport fixation on SECRET_KEY loader in config.py.",
    dependencies: "auth.py loaded",
  },
  {
    id: "n3",
    step: "03",
    label: "Environment or code?",
    type: "DECISION BRANCH",
    criticality: "Critical",
    status: "Verified",
    description: "Branch point evaluating whether authentication failure is an env override or syntax logic defect.",
    evidence: "Expert speech trace: 'Let's verify whether config or validator logic is failing.'",
    dependencies: "config.py inspection",
  },
  {
    id: "n4",
    step: "04",
    label: "Modify validator",
    type: "ACTION",
    criticality: "High",
    status: "Verified",
    description: "Refactor verify_token() validation block to strip whitespace and enforce key length.",
    evidence: "32 keystrokes inserted at lines 42-45 in auth.py.",
    dependencies: "Code bug confirmed",
  },
  {
    id: "n5",
    step: "05",
    label: "Run tests",
    type: "VERIFICATION",
    criticality: "High",
    status: "Verified",
    description: "Execute pytest tests/test_auth.py to verify unit assertion pass state.",
    evidence: "Terminal return code 0; 8/8 tests pass.",
    dependencies: "Validator modification completed",
  },
];

export function SkillGraphWorkspace({ isOpen, onClose }) {
  const [selectedNode, setSelectedNode] = useState(DEMO_GRAPH_NODES[1]);

  if (!isOpen) return null;

  return (
    <div className="workspace-overlay-backdrop">
      <div className="workspace-overlay-shell">
        <div className="workspace-top-bar">
          <div className="workspace-header-info">
            <span className="demo-workflow-badge">DEMO WORKFLOW · FRONTEND VISUALIZATION ONLY</span>
            <h2 className="workspace-title">Executable Skill Graph (DebugLab Workflow)</h2>
          </div>

          <button className="btn-workspace-close" onClick={onClose} aria-label="Close skill graph">
            ✕ CLOSE
          </button>
        </div>

        <div className="workspace-content-body">
          <div className="graph-workspace-grid">
            {/* Visual DAG Canvas */}
            <div className="graph-canvas-box">
              <div className="canvas-banner-row">
                <span className="canvas-file-tag">workflow / auth_debug_skill.json</span>
                <span className="canvas-node-count">5 Nodes Defined</span>
              </div>

              <div className="graph-vertical-flow">
                {DEMO_GRAPH_NODES.map((node, i) => {
                  const isSelected = selectedNode.id === node.id;
                  return (
                    <div key={node.id} className="graph-step-unit">
                      <button
                        className={`graph-node-button ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedNode(node)}
                      >
                        <div className="node-head-row">
                          <span className="node-step-number">STEP {node.step}</span>
                          <span className="node-type-badge">{node.type}</span>
                        </div>
                        <h4 className="node-label-title">{node.label}</h4>
                        <div className="node-foot-row">
                          <span className={`node-crit-tag ${node.criticality.toLowerCase()}`}>
                            {node.criticality === "Critical" ? "★ Critical Check" : node.criticality}
                          </span>
                          <span className="node-status-tag">{node.status}</span>
                        </div>
                      </button>

                      {i < DEMO_GRAPH_NODES.length - 1 && (
                        <div className="graph-edge-down">
                          <span className="edge-line" />
                          <span className="edge-chevron">↓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right-Side Node Detail Inspector */}
            <div className="graph-detail-inspector">
              <div className="inspector-head">
                <span className="inspector-kicker">NODE INSPECTION</span>
                <h3 className="inspector-title">{selectedNode.label}</h3>
              </div>

              <div className="inspector-fields">
                <div className="inspector-field">
                  <span className="field-label">Step Index</span>
                  <span className="field-val font-mono">{selectedNode.step}</span>
                </div>

                <div className="inspector-field">
                  <span className="field-label">Node Category</span>
                  <span className="field-val font-mono">{selectedNode.type}</span>
                </div>

                <div className="inspector-field">
                  <span className="field-label">Criticality</span>
                  <span className="field-val font-mono highlight">{selectedNode.criticality}</span>
                </div>

                <div className="inspector-field">
                  <span className="field-label">Verification Status</span>
                  <span className="field-val font-mono">{selectedNode.status}</span>
                </div>

                <div className="inspector-field vertical">
                  <span className="field-label">Behavioral Rationale</span>
                  <p className="field-desc">{selectedNode.description}</p>
                </div>

                <div className="inspector-field vertical">
                  <span className="field-label">Observable Evidence</span>
                  <div className="evidence-code-container">
                    <code>{selectedNode.evidence}</code>
                  </div>
                </div>

                <div className="inspector-field vertical">
                  <span className="field-label">Prerequisite Dependency</span>
                  <span className="field-desc font-mono">{selectedNode.dependencies}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillGraphWorkspace;
