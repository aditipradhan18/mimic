let SESSION_ID = `EXP-${Date.now()}`;
let events = [];
let sessionStarted = false;

export function startSession() {
  if (sessionStarted) {
    return;
  }

  sessionStarted = true;
  SESSION_ID = `EXP-${Date.now()}`;
  events = [];

  const startTime = Date.now();

  sessionStorage.setItem("mimicSessionId", SESSION_ID);
  sessionStorage.setItem("mimicStart", startTime.toString());
  sessionStorage.setItem("mimicEvents", JSON.stringify([]));

  logEvent("SESSION_STARTED");
}

export function logEvent(type, data = {}) {
  const startTime = Number(sessionStorage.getItem("mimicStart"));
  const now = Date.now();

  const event = {
    sessionId: sessionStorage.getItem("mimicSessionId") || SESSION_ID,
    timestamp: now,
    relativeTime: startTime > 0 ? now - startTime : 0,
    type,
    ...data,
  };

  events.push(event);

  try {
    sessionStorage.setItem("mimicEvents", JSON.stringify(events));
  } catch (err) {
    console.warn("[MIMIC] Storage quota warning:", err);
  }

  console.log("[MIMIC EVENT]", event);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mimic:event", { detail: event }));
  }

  return event;
}

export function getEvents() {
  try {
    return JSON.parse(sessionStorage.getItem("mimicEvents") || "[]");
  } catch {
    return [];
  }
}

export function clearEvents() {
  events = [];
  sessionStarted = false;
  sessionStorage.removeItem("mimicEvents");
  sessionStorage.removeItem("mimicSessionId");
  sessionStorage.removeItem("mimicStart");
}

export function getSessionId() {
  return sessionStorage.getItem("mimicSessionId") || SESSION_ID;
}