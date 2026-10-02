import { useEffect, useMemo, useState } from "react";
import { logEvent } from "../../eventLogger";

const files = {
  "README.md": {
    language: "markdown",
    content: `# Authentication Service

## Debugging Task

The authentication service is failing some requests.

Before modifying authentication logic:

1. Inspect the configuration.
2. Verify the authentication mode.
3. Inspect the validator.
4. Run the test suite.

The expected result is a clean authentication test run.
`,
  },

  "config.py": {
    language: "python",
    content: `AUTH_MODE = "strict"
TOKEN_EXPIRY = 3600
REQUIRE_SIGNATURE = True

# Production authentication configuration.
`,
  },

  "auth.py": {
    language: "python",
    content: `def validate_token(token, config):
    if not token:
        return False

    if config["AUTH_MODE"] == "strict":
        return verify_signature(token)

    return True


def verify_signature(token):
    # BUG: signature verification currently rejects
    # tokens with the expected production format.
    return token.startswith("demo_")
`,
  },

  "tests.py": {
    language: "python",
    content: `def test_valid_token():
    config = {
        "AUTH_MODE": "strict"
    }

    token = "prod_valid_token"

    assert validate_token(token, config) is True


def test_invalid_token():
    config = {
        "AUTH_MODE": "strict"
    }

    token = ""

    assert validate_token(token, config) is False
`,
  },
};

const workflow = [
  {
    id: "inspect-readme",
    label: "Inspect README",
    description: "Understand the debugging task before editing code.",
    target: "README.md",
  },
  {
    id: "inspect-config",
    label: "Inspect configuration",
    description: "Verify authentication settings before touching validation logic.",
    target: "config.py",
  },
  {
    id: "inspect-auth",
    label: "Inspect authentication",
    description: "Trace the validator and identify the failing behavior.",
    target: "auth.py",
  },
  {
    id: "run-tests",
    label: "Run test suite",
    description: "Confirm the failure before applying the fix.",
    target: "tests.py",
  },
  {
    id: "apply-fix",
    label: "Apply authentication fix",
    description: "Correct the validation behavior.",
    target: "auth.py",
  },
  {
    id: "verify",
    label: "Verify solution",
    description: "Run the tests again and confirm success.",
    target: "tests.py",
  },
];

export function DebugLabWorkspace({ isOpen, onClose }) {
  const [activeFile, setActiveFile] = useState("README.md");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [testStatus, setTestStatus] = useState("not_run");
  const [showWorkflow, setShowWorkflow] = useState(true);

  const currentFile = files[activeFile];

  const progress = useMemo(() => {
    return Math.round(
      (completedSteps.length / workflow.length) * 100
    );
  }, [completedSteps]);

  useEffect(() => {
    if (!isOpen) return;

    logEvent("DEBUGLAB_OPENED");

    return () => {
      logEvent("DEBUGLAB_CLOSED");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const recordAction = (type, payload = {}) => {
    logEvent(`DEBUGLAB_${type}`, payload);
  };

  const markStep = (stepId) => {
    setCompletedSteps((previous) => {
      if (previous.includes(stepId)) {
        return previous;
      }

      return [...previous, stepId];
    });
  };

  const handleFileOpen = (filename) => {
    setActiveFile(filename);

    recordAction("FILE_OPENED", {
      file: filename,
    });

    const step = workflow.find(
      (item) => item.target === filename
    );

    if (step) {
      markStep(step.id);
    }
  };

  const handleRunTests = () => {
    recordAction("TESTS_RUN");

    const hasInspectedConfig =
      completedSteps.includes("inspect-config");

    const hasInspectedAuth =
      completedSteps.includes("inspect-auth");

    if (!hasInspectedConfig || !hasInspectedAuth) {
      setTestStatus("failed");

      recordAction("TESTS_FAILED", {
        reason: "authentication_validation_failure",
      });

      return;
    }

    setTestStatus("passed");

    markStep("run-tests");

    recordAction("TESTS_PASSED");
  };

  const handleApplyFix = () => {
    recordAction("FIX_APPLIED", {
      file: "auth.py",
    });

    markStep("apply-fix");

    setTestStatus("ready_for_verification");
  };

  const handleVerify = () => {
    recordAction("VERIFICATION_STARTED");

    setTestStatus("passed");

    markStep("verify");

    recordAction("VERIFICATION_PASSED");
  };

  const resetLab = () => {
    setActiveFile("README.md");
    setCompletedSteps([]);
    setTestStatus("not_run");

    recordAction("LAB_RESET");
  };

  return (
    <div className="workspace-overlay-backdrop">
      <div className="workspace-overlay-shell debuglab-shell">

        <div className="workspace-top-bar">
          <div className="workspace-header-info">
            <span className="workspace-mode-tag">
              MIMIC DEBUGLAB
            </span>

            <h2 className="workspace-title">
              Expert Workflow Environment
            </h2>

            <div className="debuglab-subtitle">
              Controlled environment for learning executable
              debugging behavior.
            </div>
          </div>

          <button
            className="btn-workspace-close"
            onClick={onClose}
          >
            ✕ CLOSE
          </button>
        </div>

        <div className="debuglab-toolbar">

          <div className="debuglab-task-info">
            <span className="debuglab-task-label">
              ACTIVE TASK
            </span>

            <strong>
              Diagnose authentication validation failure
            </strong>
          </div>

          <div className="debuglab-progress">
            <span>
              WORKFLOW {completedSteps.length}/{workflow.length}
            </span>

            <div className="debuglab-progress-track">
              <div
                className="debuglab-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span>{progress}%</span>
          </div>

          <button
            className="debuglab-reset"
            onClick={resetLab}
          >
            RESET
          </button>

        </div>

        <div className="debuglab-body">

          <aside className="debuglab-sidebar">

            <div className="debuglab-sidebar-title">
              PROJECT FILES
            </div>

            <div className="debuglab-file-list">

              {Object.keys(files).map((filename) => (
                <button
                  key={filename}
                  className={`debuglab-file ${
                    activeFile === filename
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleFileOpen(filename)}
                >
                  <span className="debuglab-file-icon">
                    {filename.endsWith(".py")
                      ? "PY"
                      : "MD"}
                  </span>

                  <span>{filename}</span>

                  {completedSteps.some(
                    (stepId) =>
                      workflow.find(
                        (step) => step.id === stepId
                      )?.target === filename
                  ) && (
                    <span className="debuglab-check">
                      ✓
                    </span>
                  )}
                </button>
              ))}

            </div>

            <div className="debuglab-sidebar-divider" />

            <button
              className={`debuglab-run-button ${
                testStatus === "passed"
                  ? "passed"
                  : ""
              }`}
              onClick={handleRunTests}
            >
              <span>▶</span>
              <span>RUN TESTS</span>
            </button>

            <div className="debuglab-test-status">

              <span className="debuglab-status-label">
                TEST STATUS
              </span>

              {testStatus === "not_run" && (
                <span className="debuglab-status-idle">
                  NOT RUN
                </span>
              )}

              {testStatus === "failed" && (
                <span className="debuglab-status-failed">
                  ✕ FAILED
                </span>
              )}

              {testStatus === "ready_for_verification" && (
                <span className="debuglab-status-ready">
                  READY
                </span>
              )}

              {testStatus === "passed" && (
                <span className="debuglab-status-passed">
                  ✓ PASSED
                </span>
              )}

            </div>

          </aside>

          <main className="debuglab-editor">

            <div className="debuglab-editor-header">

              <div className="debuglab-breadcrumb">
                PROJECT / {activeFile}
              </div>

              <div className="debuglab-editor-state">
                READ / EDIT MODE
              </div>

            </div>

            <div className="debuglab-code-window">

              <div className="debuglab-line-numbers">
                {currentFile.content
                  .split("\n")
                  .map((_, index) => (
                    <span key={index}>
                      {index + 1}
                    </span>
                  ))}
              </div>

              <pre className="debuglab-code">
                {currentFile.content}
              </pre>

            </div>

            {activeFile === "auth.py" &&
              testStatus === "failed" && (
                <div className="debuglab-fix-panel">

                  <div>
                    <span className="debuglab-fix-tag">
                      DIAGNOSTIC
                    </span>

                    <strong>
                      Authentication validator identified
                      as the failing component.
                    </strong>

                    <p>
                      Apply the production validation
                      behavior before verifying the test suite.
                    </p>
                  </div>

                  <button
                    className="debuglab-fix-button"
                    onClick={handleApplyFix}
                  >
                    APPLY FIX →
                  </button>

                </div>
              )}

            {activeFile === "tests.py" &&
              testStatus === "ready_for_verification" && (
                <div className="debuglab-fix-panel">

                  <div>
                    <span className="debuglab-fix-tag">
                      FIX APPLIED
                    </span>

                    <strong>
                      Authentication logic updated.
                    </strong>

                    <p>
                      Run verification to confirm the workflow
                      completed successfully.
                    </p>
                  </div>

                  <button
                    className="debuglab-fix-button"
                    onClick={handleVerify}
                  >
                    VERIFY →
                  </button>

                </div>
              )}

            {testStatus === "passed" && (
              <div className="debuglab-success-panel">

                <span className="debuglab-success-icon">
                  ✓
                </span>

                <div>
                  <strong>
                    Verification successful
                  </strong>

                  <span>
                    Authentication workflow completed.
                  </span>
                </div>

              </div>
            )}

          </main>

          {showWorkflow && (
            <aside className="debuglab-workflow">

              <div className="debuglab-workflow-header">
                <span>LEARNED WORKFLOW</span>

                <button
                  onClick={() =>
                    setShowWorkflow(false)
                  }
                >
                  ×
                </button>
              </div>

              <div className="debuglab-workflow-note">
                During expert capture, MIMIC observes the
                sequence and timing of these actions.
              </div>

              <div className="debuglab-workflow-list">

                {workflow.map((step, index) => {
                  const completed =
                    completedSteps.includes(step.id);

                  return (
                    <div
                      key={step.id}
                      className={`debuglab-workflow-step ${
                        completed
                          ? "completed"
                          : ""
                      }`}
                    >

                      <div className="debuglab-step-number">
                        {completed
                          ? "✓"
                          : String(index + 1).padStart(
                              2,
                              "0"
                            )}
                      </div>

                      <div className="debuglab-step-content">

                        <strong>
                          {step.label}
                        </strong>

                        <span>
                          {step.description}
                        </span>

                      </div>

                    </div>
                  );
                })}

              </div>

            </aside>
          )}

          {!showWorkflow && (
            <button
              className="debuglab-show-workflow"
              onClick={() =>
                setShowWorkflow(true)
              }
            >
              SHOW WORKFLOW
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default DebugLabWorkspace;