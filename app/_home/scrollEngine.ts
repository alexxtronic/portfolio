/* Scroll engine for the homepage.
   The page is a stack of full-screen .stage sections, each optionally followed by a .dwell spacer.
   Every stage pins (sticky) and stays pinned, so later stages arrive over earlier ones.
   Each stage gets three CSS variables, all 0 to 1:
     --r  how far it has arrived (0 below the fold, 1 fully in place)
     --p  progress through its dwell, while it holds still
     --o  how far the next stage has arrived over it
   With reduced motion, stages fall back to normal flow (.still on the root). */

export interface StageItem {
  stage: HTMLElement;
  sentinel: HTMLElement;
  dwell: HTMLElement | null;
  top: number;
  r: number;
  o: number;
  p: number;
}

export interface FrameState {
  h: number;
  still: boolean;
  items: StageItem[];
}

export interface ScrollEngine {
  onFrame: (fn: (state: FrameState) => void) => void;
  countUp: (el: HTMLElement) => void;
  update: () => void;
  destroy: () => void;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function startScrollEngine(root: HTMLElement): ScrollEngine {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const stages = [...root.querySelectorAll<HTMLElement>(".stage")];
  const markers = [...root.querySelectorAll<HTMLElement>("[data-label]")];
  const bar = root.querySelector<HTMLElement>("#bar");
  const label = root.querySelector<HTMLElement>("#barLabel");
  const hooks: ((state: FrameState) => void)[] = [];
  const timers: number[] = [];
  let still = false;
  let active = -1;
  let ticking = false;

  // A zero-height sentinel before each stage marks where the stage sits in flow, unaffected by sticky or transforms.
  const items: StageItem[] = stages.map((stage) => {
    const sentinel = document.createElement("i");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "display:block;height:0;pointer-events:none";
    stage.before(sentinel);
    const next = stage.nextElementSibling as HTMLElement | null;
    const dwell = next && next.classList.contains("dwell") ? next : null;
    return { stage, sentinel, dwell, top: 0, r: 0, o: 0, p: 0 };
  });

  function layout() {
    still = reduce.matches;
    root.classList.toggle("still", still);
    const h = innerHeight;
    // Stages taller than the screen (phones) scroll fully before they pin.
    items.forEach((it) => {
      it.top = still ? 0 : Math.min(0, h - it.stage.offsetHeight);
      it.stage.style.top = it.top + "px";
    });
    update();
  }

  function countUp(el: HTMLElement) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    if (still) return;
    const target = parseFloat(el.dataset.count || "0");
    const dec = +(el.dataset.decimals || 0);
    const pre = el.dataset.prefix || "";
    const suf = el.dataset.suffix || "";
    const t0 = performance.now();
    const dur = +(el.dataset.duration || 1300);
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (target * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function setActive(i: number) {
    if (i === active || !markers[i]) return;
    active = i;
    const toneEl = markers[i].closest<HTMLElement>("[data-tone]");
    if (bar && toneEl) bar.dataset.tone = toneEl.dataset.tone;
    if (!label) return;
    label.classList.add("is-swapping");
    timers.push(
      window.setTimeout(() => {
        if (label.firstElementChild) label.firstElementChild.textContent = markers[active].dataset.label || "";
        label.classList.remove("is-swapping");
      }, 180)
    );
  }

  function update() {
    ticking = false;
    const h = innerHeight;
    items.forEach((it, i) => {
      const s = it.sentinel.getBoundingClientRect().top;
      const dwellH = it.dwell ? it.dwell.offsetHeight : 0;
      it.r = still || i === 0 ? 1 : clamp(1 - s / h);
      it.p = still ? 1 : dwellH ? clamp((it.top - s) / dwellH) : s <= it.top + 1 ? 1 : 0;
    });
    items.forEach((it, i) => {
      it.o = still || !items[i + 1] ? 0 : items[i + 1].r;
      const st = it.stage.style;
      st.setProperty("--r", it.r.toFixed(4));
      st.setProperty("--p", it.p.toFixed(4));
      st.setProperty("--o", it.o.toFixed(4));
      it.stage.classList.toggle("is-here", it.r > 0.6 && it.o < 0.6);
    });

    let cur = 0;
    markers.forEach((m, i) => {
      const it = items.find((x) => x.stage === m);
      const on = it ? it.r >= 0.5 : m.getBoundingClientRect().top <= h * 0.5;
      if (on) cur = i;
    });
    setActive(cur);
    hooks.forEach((fn) => fn({ h, still, items }));
  }

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", layout);
  reduce.addEventListener("change", layout);
  document.fonts?.ready.then(layout);
  addEventListener("load", layout);
  layout();

  return {
    onFrame: (fn) => hooks.push(fn),
    countUp,
    update,
    destroy() {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", layout);
      removeEventListener("load", layout);
      reduce.removeEventListener("change", layout);
      timers.forEach(clearTimeout);
      items.forEach((it) => it.sentinel.remove());
      hooks.length = 0;
    },
  };
}
