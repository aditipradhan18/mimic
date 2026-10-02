export function Navbar({
  onOpenCapture,
  onOpenGraph,
  onOpenMonitor,
  onOpenDebugLab,
  isRecording,
  backendStatus,
}) {
  const isOnline =
    backendStatus === "online";

  const isChecking =
    backendStatus === "checking";

  const statusLabel = isOnline
    ? "SYSTEM READY"
    : isChecking
      ? "CONNECTING"
      : "BACKEND OFFLINE";

  return (
    <header className="mimic-navbar">
      <div className="navbar-container">

        <a
          href="#top"
          className="navbar-brand"
        >
          <span className="brand-symbol">
            <span className="symbol-glass" />
          </span>

          <span className="brand-wordmark">
            MIMIC
          </span>
        </a>

        <nav className="navbar-nav">

          <a
            href="#top"
            className="nav-link"
          >
            <span>Product</span>
          </a>

          <a
            href="#how-it-works"
            className="nav-link"
          >
            <span>How it Works</span>
          </a>

          <button
            className="nav-link-btn"
            onClick={onOpenGraph}
          >
            <span>Skill Graph</span>
          </button>

          <button
            className="nav-link-btn"
            onClick={onOpenMonitor}
          >
            <span>Live Transfer</span>
          </button>

          <button
            className="nav-link-btn"
            onClick={onOpenDebugLab}
          >
            <span>DebugLab</span>
          </button>

        </nav>

        <div className="navbar-actions">

          <div
            className={`system-status-indicator ${
              isOnline
                ? "status-online"
                : isChecking
                  ? "status-checking"
                  : "status-offline"
            }`}
          >
            <span className="status-dot-active" />

            <span className="status-text">
              {statusLabel}
            </span>
          </div>

          <button
            className={`btn-navbar-cta ${
              isRecording
                ? "recording"
                : ""
            }`}
            onClick={onOpenCapture}
          >
            <span className="btn-utility-dot" />

            <span>
              {isRecording
                ? "RECORDING DEMO"
                : "START DEMONSTRATION"}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;