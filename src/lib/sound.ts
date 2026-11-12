let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, when = 0) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  const t0 = c.currentTime + when;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Короткий терминальный щелчок при отметке. */
export function blip(on: boolean) {
  if (on) {
    tone(740, 0.07, "square", 0.035);
    tone(1180, 0.09, "square", 0.025, 0.05);
  } else {
    tone(520, 0.06, "square", 0.03);
    tone(330, 0.08, "square", 0.02, 0.04);
  }
}

/** Более длинный сигнал — локация полностью закрыта. */
export function chime() {
  tone(660, 0.12, "triangle", 0.05);
  tone(880, 0.12, "triangle", 0.05, 0.1);
  tone(1320, 0.22, "triangle", 0.045, 0.2);
}

export function tick() {
  tone(2200, 0.025, "square", 0.012);
}
