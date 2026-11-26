const SOUND_PREF_KEY = "clinicflow.notification.sound";

let sharedAudioCtx = null;
let unlockRegistered = false;

function getAudioContextConstructor() {
  if (typeof window === "undefined") return null;
  return window.AudioContext || window.webkitAudioContext || null;
}

function getOrCreateAudioContext() {
  const AudioCtx = getAudioContextConstructor();
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  return sharedAudioCtx;
}

export function registerAudioUnlock() {
  if (typeof window === "undefined" || unlockRegistered) return;
  unlockRegistered = true;

  const unlock = () => {
    try {
      const ctx = getOrCreateAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    } catch {
      // Ignore browser audio unlock failures
    }
  };

  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
}

export function isNotificationSoundEnabled() {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem(SOUND_PREF_KEY);
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
}

export function setNotificationSoundEnabled(enabled) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOUND_PREF_KEY, enabled ? "true" : "false");
    window.dispatchEvent(new CustomEvent("clinicflow:sound-pref", { detail: enabled }));
  } catch {
    // Ignore storage errors
  }
}

function scheduleChime(ctx, type) {
  const now = ctx.currentTime;
  const isUrgent = type === "next" || type === "approaching";

  // Pleasant ascending bell tones (urgent queue alert uses a 3-note chime)
  const notes = isUrgent
    ? [
        { freq: 659.25, start: 0, duration: 0.22, gain: 0.16 }, // E5
        { freq: 830.61, start: 0.13, duration: 0.22, gain: 0.16 }, // G#5
        { freq: 987.77, start: 0.26, duration: 0.38, gain: 0.18 }, // B5
      ]
    : [
        { freq: 587.33, start: 0, duration: 0.2, gain: 0.14 }, // D5
        { freq: 880.0, start: 0.13, duration: 0.32, gain: 0.15 }, // A5
      ];

  notes.forEach(({ freq, start, duration, gain }) => {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + start);

    amp.gain.setValueAtTime(0.0001, now + start);
    amp.gain.exponentialRampToValueAtTime(gain, now + start + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

    osc.connect(amp);
    amp.connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + duration + 0.02);
  });
}

export function playNotificationSound(type = "update", { force = false } = {}) {
  if (!force && !isNotificationSoundEnabled()) return false;

  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      ctx
        .resume()
        .then(() => {
          scheduleChime(ctx, type);
        })
        .catch(() => {});
      return true;
    }

    scheduleChime(ctx, type);
    return true;
  } catch {
    return false;
  }
}

registerAudioUnlock();
