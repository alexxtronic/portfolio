"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/notion";
import { startScrollEngine } from "./scrollEngine";
import "./home.css";

const NS = "http://www.w3.org/2000/svg";
const rad = Math.PI / 180;
const clamp = (v: number) => Math.min(1, Math.max(0, v));

// Campaign cities on the Global Citizen globe; New York (first) is highlighted.
const cities: [number, number][] = [[40.7, -74], [51.5, -0.1], [6.5, 3.4], [-26.2, 28], [19, 72.8], [-22.9, -43.2], [19.4, -99.1], [-6.2, 106.8], [-1.3, 36.8]];
const G = { cx: 150, cy: 150, R: 140, tilt: 0.38 };

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

// Draws the wireframe globe for a given rotation, splitting each line into front and back halves.
function makeGlobe(globe: SVGSVGElement) {
  const dots = cities.map((_, i) => {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("r", i ? "3" : "5.5");
    c.setAttribute("class", i ? "fill" : "mark");
    globe.querySelector("[data-cities]")?.append(c);
    return c;
  });
  const tag = globe.querySelector<SVGGElement>("[data-tag]");
  const project = (lat: number, lon: number, rot: number): [number, number, boolean] => {
    const X = Math.cos(lat) * Math.sin(lon + rot), Y = Math.sin(lat), Z = Math.cos(lat) * Math.cos(lon + rot);
    const y = Y * Math.cos(G.tilt) - Z * Math.sin(G.tilt);
    return [G.cx + G.R * X, G.cy - G.R * y, Y * Math.sin(G.tilt) + Z * Math.cos(G.tilt) > 0];
  };
  const range = (a: number, b: number, s: number) => Array.from({ length: Math.round((b - a) / s) + 1 }, (_, i) => a + i * s);
  const draw = (rot: number) => {
    let front = "", back = "";
    const line = (pts: [number, number, boolean][]) => {
      let prev: boolean | null = null;
      pts.forEach(([x, y, f]) => {
        const cmd = (prev === f ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
        if (f) front += cmd; else back += cmd;
        prev = f;
      });
    };
    for (let lon = 0; lon < 360; lon += 30) line(range(-90, 90, 6).map((lat) => project(lat * rad, lon * rad, rot)));
    [-60, -30, 0, 30, 60].forEach((lat) => line(range(0, 360, 6).map((lon) => project(lat * rad, lon * rad, rot))));
    globe.querySelector("[data-front]")?.setAttribute("d", front);
    globe.querySelector("[data-back]")?.setAttribute("d", back);
    cities.forEach(([lat, lon], i) => {
      const [x, y, f] = project(lat * rad, lon * rad, rot);
      dots[i].setAttribute("cx", x.toFixed(1));
      dots[i].setAttribute("cy", y.toFixed(1));
      dots[i].style.visibility = f ? "" : "hidden";
      if (i || !tag) return;
      tag.style.visibility = f ? "" : "hidden";
      tag.querySelector("path")?.setAttribute("d", `M${(x + 9).toFixed(1)} ${y.toFixed(1)}H298`);
      const t = tag.querySelector("text");
      t?.setAttribute("x", "304");
      t?.setAttribute("y", (y + 3.5).toFixed(1));
    });
  };
  return { draw, remove: () => dots.forEach((d) => d.remove()) };
}

export default function HomeClient({ posts }: { posts: BlogPost[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const engine = startScrollEngine(root);
    const globeEl = root.querySelector<SVGSVGElement>(".globe");
    const globe = globeEl ? makeGlobe(globeEl) : null;

    // Each chapter: fly through the word in the first half of its dwell, then the details settle in and the graphic draws.
    engine.onFrame(({ still, items }) => {
      items.forEach((it) => {
        if (!it.stage.classList.contains("zoom")) return;
        const s = it.stage.style;
        const figs = it.stage.querySelectorAll<HTMLElement>("[data-count]");
        const hasGlobe = !!globeEl && it.stage.contains(globeEl);
        if (still) {
          s.setProperty("--do", "1");
          s.setProperty("--g", "1");
          figs.forEach(engine.countUp);
          if (hasGlobe) globe?.draw(1.2);
          return;
        }
        const z = clamp(it.p / 0.5);
        s.setProperty("--ws", (1 + 34 * z * z * z).toFixed(3));
        s.setProperty("--wo", (1 - clamp((z - 0.72) / 0.28)).toFixed(3));
        const d = clamp((it.p - 0.42) / 0.22);
        s.setProperty("--do", d.toFixed(3));
        s.setProperty("--g", clamp((it.p - 0.5) / 0.32).toFixed(3));
        if (d > 0.5) figs.forEach(engine.countUp);
        if (hasGlobe && it.r > 0 && it.o < 1) globe?.draw(0.35 + it.p * 1.05 + it.o * 0.6);
      });
    });
    engine.update();

    // Copy buttons: data-copy names the id of the element whose text is copied.
    const copyOff = [...root.querySelectorAll<HTMLButtonElement>("[data-copy]")].map((btn) => {
      const src = root.querySelector<HTMLElement>("#" + btn.dataset.copy);
      const idle = btn.textContent;
      const onClick = () => {
        if (!src) return;
        const done = () => {
          btn.textContent = "Copied";
          setTimeout(() => { btn.textContent = idle; }, 1800);
        };
        const fallback = () => {
          const r = document.createRange();
          r.selectNodeContents(src);
          const sel = getSelection();
          sel?.removeAllRanges();
          sel?.addRange(r);
          btn.textContent = "Selected, press Copy";
        };
        navigator.clipboard?.writeText((src.textContent || "").trim()).then(done, fallback) ?? fallback();
      };
      btn.addEventListener("click", onClick);
      return () => btn.removeEventListener("click", onClick);
    });

    // Contact form: post to Formspree; if it can't be reached, open the visitor's email app with the note filled in.
    const form = root.querySelector<HTMLFormElement>("#talkForm");
    const status = root.querySelector<HTMLElement>("#formStatus");
    const onSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      if (!form || !status) return;
      let first: HTMLInputElement | HTMLTextAreaElement | null = null;
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[required]").forEach((f) => {
        const bad = !f.value.trim() || (f.type === "email" && !f.checkValidity());
        f.setAttribute("aria-invalid", String(bad));
        if (bad && !first) first = f;
      });
      if (first) {
        status.textContent = "Add your name, a valid email and a few words, then send.";
        (first as HTMLElement).focus();
        return;
      }
      const data = new FormData(form);
      status.textContent = "Sending…";
      try {
        const res = await fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        status.textContent = "Thanks, it’s on its way to my inbox. I’ll be in touch soon.";
      } catch {
        const body = `${data.get("message")}\n\n${data.get("name")} · ${data.get("email")}`;
        location.href = `mailto:alexdamore2@gmail.com?subject=${encodeURIComponent(`${data.get("kind")} enquiry from ${data.get("name")}`)}&body=${encodeURIComponent(body)}`;
        status.textContent = "Opening your email app with your note filled in. If nothing opens, write to alexdamore2@gmail.com.";
      }
    };
    form?.addEventListener("submit", onSubmit);

    return () => {
      engine.destroy();
      globe?.remove();
      copyOff.forEach((off) => off());
      form?.removeEventListener("submit", onSubmit);
    };
  }, []);

  return (
    <div className="e2" ref={rootRef}>
      <header className="bar" id="bar" data-tone="light">
        <div className="bar__row">
          <a className="bar__name" href="#top">A. D&rsquo;Amore</a>
          <div className="bar__label" id="barLabel" aria-live="polite"><span>Index</span></div>
          <nav className="bar__nav" aria-label="Primary"><a href="#work">Work</a><a href="#notes">Notes</a><a href="#hire">Hire</a></nav>
        </div>
      </header>

      <main>
        <section className="stage" id="top" data-tone="light" data-label="Index">
          <div className="stage__in">
            <p className="head mono"><span><span className="sq" aria-hidden="true"></span>Senior marketing creative &amp; MarTech strategist</span><span>Copenhagen &middot; Ex-New York</span></p>
            <div className="hero__stack">
              <figure className="hero__photo"><img src="/assets/images/headshot.webp" alt="Portrait of Alexander D&rsquo;Amore" width="1445" height="2000" /></figure>
              <div className="hero__name"><h1>Alexander</h1><h1>D&rsquo;Amore<span className="dot">.</span></h1></div>
            </div>
            <div className="hero__foot">
              <p className="lede">Over a decade making brands people stop scrolling for, and building the CRM and automation that turn that attention into pipeline. Based in Copenhagen, freelancing remotely for US teams.</p>
              <div className="actions"><a className="btn btn--solid" href="#hire">Start a project <span aria-hidden="true">&rarr;</span></a><a className="btn" href="#work">Scroll the story <span aria-hidden="true">&darr;</span></a></div>
            </div>
          </div>
        </section>
        <div className="dwell" aria-hidden="true"></div>

        <section className="stage zoom" id="work" data-tone="dark" data-label="01 / Empire State">
          <div className="word" aria-hidden="true" style={{ "--chars": "8", "--ox": "47%" } as React.CSSProperties}><span>Landmark</span></div>
          <div className="stage__in detail">
            <div className="head head--client"><p className="client"><span className="sq" aria-hidden="true"></span>Empire State Building</p><p className="mono">01 &middot; Renegade &middot; New York &middot; 2017&ndash;2025</p></div>
            <div className="tower-wrap">
              <figure className="art art--tower">
                <svg className="tower" viewBox="0 0 260 440" preserveAspectRatio="xMinYMax meet" role="img" aria-label="The Empire State Building drawn as a bar chart: its antenna reaches the 2.1 million followers line.">
                  <g className="step" style={{ "--i": "0" } as React.CSSProperties}>
                    <path className="ln ln--faint" d="M64 289H260M64 147H260M64 6H260"/>
                    <text x="0" y="435">0</text><text x="0" y="294">700K</text><text x="0" y="152">1.4M</text><text x="0" y="11">2.1M</text>
                  </g>
                  <path className="ln" d="M64 430H260"/>
                  <path className="ln draw" pathLength="1" d="M100 430V400H110V380H122V150H130V128H138V112H146V100H152V64H155V52H158.5V6H161.5V52H165V64H168V100H174V112H182V128H190V150H198V380H210V400H220V430"/>
                  <path className="ln ln--faint step" style={{ "--i": "3" } as React.CSSProperties} d="M130 156V376M138 156V376M146 156V376M154 156V376M162 156V376M170 156V376M178 156V376M186 156V376M154 70V98M160 70V98M166 70V98"/>
                  <circle className="mark step" style={{ "--i": "5" } as React.CSSProperties} cx="160" cy="6" r="6"/>
                </svg>
                <figcaption className="mono">Followers gained, to scale</figcaption>
              </figure>
              <div className="tower-side">
                <ul className="stats">
                <li><strong data-count="1.2" data-decimals="1" data-suffix="M" data-manual>1.2M</strong><span className="mono">TikTok followers gained</span></li>
                <li><strong data-count="900" data-suffix="K" data-manual>900K</strong><span className="mono">New Instagram followers</span></li>
                <li><strong data-count="4" data-suffix="&times;" data-manual>4&times;</strong><span className="mono">ROAS lift on tickets and leasing</span></li>
              </ul>
                <div className="ch__body">
              <p className="figure"><span data-count="2.1" data-decimals="1" data-suffix="M" data-manual>2.1M</span><small>Followers gained</small></p>
              <div className="ch__copy"><h2>The voice of the Empire State Building.</h2><p>Led a small team of social creatives to give the Empire State Building a refreshed image for Gen Z, leading to 1.2M TikTok followers gained on top of 900K new Instagram followers. My reports helped drive a 4&times; ROAS lift in ticket sales and office leasing.</p></div>
            </div>
              </div>
            </div>
          </div>
        </section>
        <div className="dwell zd" aria-hidden="true"></div>

        <section className="stage zoom" data-tone="signal" data-label="02 / Global Citizen">
          <div className="word" aria-hidden="true" style={{ "--chars": "7", "--ox": "52%" } as React.CSSProperties}><span>Purpose</span></div>
          <div className="stage__in detail">
            <div className="head head--client"><p className="client"><span className="sq" aria-hidden="true"></span>Global Citizen</p><p className="mono">02 &middot; New York &middot; 2019&ndash;2021</p></div>
            <div className="ch__mid">
              <figure className="art">
                <svg className="globe" viewBox="0 0 420 300" preserveAspectRatio="xMinYMax meet" role="img" aria-label="A turning globe with campaign cities marked, New York highlighted.">
                  <path className="ln ln--faint" data-back d=""/>
                  <path className="ln" data-front d=""/>
                  <circle className="ln draw" pathLength="1" cx="150" cy="150" r="140"/>
                  <g data-cities className="step" style={{ "--i": "2" } as React.CSSProperties}></g>
                  <g data-tag className="step" style={{ "--i": "3" } as React.CSSProperties}><path className="ln" d=""/><text x="0" y="0">NEW YORK</text></g>
                </svg>
                <figcaption className="mono">Three causes, one audience model</figcaption>
              </figure>
              <ul className="stats">
                <li><strong data-count="60" data-suffix="K" data-manual>60K</strong><span className="mono">Festival crowd, Central Park</span></li>
                <li><strong data-count="120" data-prefix="+" data-suffix="K" data-manual>+120K</strong><span className="mono">New followers on core platforms</span></li>
                <li><strong data-count="17" data-manual>17</strong><span className="mono">Global Goals, memorised</span></li>
              </ul>
            </div>
            <div className="ch__body">
              <p className="figure"><span data-count="7" data-suffix="&times;" data-manual>7&times;</span><small>Return on ad spend</small></p>
              <div className="ch__copy"><h2>Purpose-driven growth at Global Citizen.</h2><p>Health, climate and equity campaigns built on audience research instead of guesswork. ROAS up sevenfold, and 120K new followers across core channels.</p></div>
            </div>
          </div>
        </section>
        <div className="dwell zd" aria-hidden="true"></div>

        <section className="stage zoom" data-tone="light" data-label="03 / Agentic">
          <div className="word" aria-hidden="true" style={{ "--chars": "7", "--ox": "50%" } as React.CSSProperties}><span>Agentic</span></div>
          <div className="stage__in detail">
            <div className="head head--client"><p className="client"><span className="sq" aria-hidden="true"></span>Novo Nordisk &middot; Boligsiden</p><p className="mono">03 &middot; Dear Future &middot; Copenhagen &middot; 2025&ndash;now</p></div>
            <div className="ch__mid">
              <figure className="art">
                <svg viewBox="0 0 520 240" preserveAspectRatio="xMinYMax meet" role="img" aria-label="A workflow: a 6 a.m. trigger sends two agents to read the web and the CRM, an LLM scores what they find, and results land in HubSpot and Slack.">
                  <path id="w1" className="ln draw" pathLength="1" d="M112 120C131 120 131 56 150 56"/>
                  <path id="w2" className="ln draw" pathLength="1" d="M112 120C131 120 131 184 150 184"/>
                  <path id="w3" className="ln draw" pathLength="1" d="M262 56C281 56 281 120 300 120"/>
                  <path id="w4" className="ln draw" pathLength="1" d="M262 184C281 184 281 120 300 120"/>
                  <path id="w5" className="ln draw" pathLength="1" d="M412 120H444"/>
                  <g className="step" style={{ "--i": "0" } as React.CSSProperties}><rect className="ln" style={{ fill: "var(--bg)" } as React.CSSProperties} x="0" y="100" width="112" height="40" rx="6"/><text x="12" y="124">CRON &middot; 06:00</text></g>
                  <g className="step" style={{ "--i": "1" } as React.CSSProperties}><rect className="ln" style={{ fill: "var(--bg)" } as React.CSSProperties} x="150" y="36" width="112" height="40" rx="6"/><text x="162" y="60">AGENT &middot; WEB</text></g>
                  <g className="step" style={{ "--i": "2" } as React.CSSProperties}><rect className="ln" style={{ fill: "var(--bg)" } as React.CSSProperties} x="150" y="164" width="112" height="40" rx="6"/><text x="162" y="188">AGENT &middot; CRM</text></g>
                  <g className="step" style={{ "--i": "3" } as React.CSSProperties}><rect className="fill" x="300" y="100" width="112" height="40" rx="6"/><text x="312" y="124" style={{ fill: "var(--bg)" } as React.CSSProperties}>LLM &middot; SCORE</text></g>
                  <g className="step" style={{ "--i": "4" } as React.CSSProperties}><circle className="mark" cx="450" cy="120" r="6"/><text x="464" y="116">HUBSPOT</text><text x="464" y="131">SLACK</text></g>
                  <circle className="pulse pulse--move step" style={{ "--i": "5" } as React.CSSProperties} r="3.5"><animateMotion dur="2.4s" repeatCount="indefinite"><mpath href="#w1"/></animateMotion></circle>
                  <circle className="pulse pulse--move step" style={{ "--i": "5" } as React.CSSProperties} r="3.5"><animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite"><mpath href="#w2"/></animateMotion></circle>
                  <circle className="pulse pulse--move step" style={{ "--i": "5" } as React.CSSProperties} r="3.5"><animateMotion dur="2.4s" begin=".6s" repeatCount="indefinite"><mpath href="#w3"/></animateMotion></circle>
                  <circle className="pulse pulse--move step" style={{ "--i": "5" } as React.CSSProperties} r="3.5"><animateMotion dur="2.4s" begin="1.8s" repeatCount="indefinite"><mpath href="#w4"/></animateMotion></circle>
                </svg>
                <figcaption className="mono">The brand-sentiment agent, every morning</figcaption>
              </figure>
              <ul className="stats">
                <li><strong data-count="10" data-suffix="+" data-manual>10+</strong><span className="mono">Hours a week handed back</span></li>
                <li><strong data-count="55" data-prefix="+" data-suffix="%" data-manual>+55%</strong><span className="mono">Increase in sentiment score</span></li>
                <li><strong data-count="0" data-manual>0</strong><span className="mono">Spreadsheets updated by hand</span></li>
              </ul>
            </div>
            <div className="ch__body">
              <p className="figure"><span data-count="70" data-prefix="&minus;" data-suffix="%" data-manual>&minus;70%</span><small>Manual reporting and lead routing</small></p>
              <div className="ch__copy"><h2>Agentic lift changed everything.</h2><p>An AI agent platform tracking Novo Nordisk&rsquo;s brand sentiment across the web, an AI search strategy for Boligsiden, and n8n workflows underneath it all.</p></div>
            </div>
          </div>
        </section>
        <div className="dwell zd" aria-hidden="true"></div>

        <section className="stage zoom" data-tone="dark" data-label="04 / Specsavers">
          <div className="word" aria-hidden="true" style={{ "--chars": "6", "--ox": "50%" } as React.CSSProperties}><span>Scored</span></div>
          <div className="stage__in detail">
            <div className="head head--client"><p className="client"><span className="sq" aria-hidden="true"></span>Specsavers</p><p className="mono">04 &middot; Marketing automation &middot; 2025</p></div>
            <div className="ch__mid">
              <figure className="art">
                <svg className="crm" viewBox="0 0 470 262" preserveAspectRatio="xMinYMax meet" role="img" aria-label="A CRM lead list sorted by score. Each lead is enriched by Clay and given a score; the top lead, scored 94, is marked as a sales-qualified lead.">
                  <g className="step" style={{ "--i": "0" } as React.CSSProperties}><text x="0" y="14">LEAD</text><text x="214" y="14">SCORE</text><text x="338" y="14">CLAY</text><text x="406" y="14">STAGE</text><path className="ln ln--faint" d="M0 24H470"/></g>
                  <g className="step hit" style={{ "--i": "0.6" } as React.CSSProperties}><circle className="ln" cx="16" cy="50" r="15"/><text x="16" y="53.5" textAnchor="middle">DW</text><text className="nm" x="42" y="47">Dana Whitfield</text><text x="42" y="62">NORTHWIND OPTICAL</text><text className="sc" x="214" y="56">94</text><rect className="track" x="246" y="49" width="76" height="4"/><rect className="bar grow grow--l" style={{ "--i": "1.0" } as React.CSSProperties} x="246" y="49" width="71.4" height="4"/><text x="338" y="55">&#10003; ENRICHED</text><rect className="pill" x="406" y="40" width="56" height="20" rx="10"/><text className="pt" x="434" y="53.5" textAnchor="middle">SQL</text><path className="ln ln--faint" d="M0 72H470"/></g>
                  <g className="step" style={{ "--i": "1.3" } as React.CSSProperties}><circle className="ln" cx="16" cy="96" r="15"/><text x="16" y="99.5" textAnchor="middle">ML</text><text className="nm" x="42" y="93">Marcus Lee</text><text x="42" y="108">BRIGHTLINE RETAIL</text><text className="sc" x="214" y="102">81</text><rect className="track" x="246" y="95" width="76" height="4"/><rect className="bar grow grow--l" style={{ "--i": "1.7" } as React.CSSProperties} x="246" y="95" width="61.6" height="4"/><text x="338" y="101">&#10003; ENRICHED</text><rect className="pill" x="406" y="86" width="56" height="20" rx="10"/><text className="pt" x="434" y="99.5" textAnchor="middle">MQL</text><path className="ln ln--faint" d="M0 118H470"/></g>
                  <g className="step" style={{ "--i": "2.0" } as React.CSSProperties}><circle className="ln" cx="16" cy="142" r="15"/><text x="16" y="145.5" textAnchor="middle">PS</text><text className="nm" x="42" y="139">Priya Shah</text><text x="42" y="154">HALDEN CLINICS</text><text className="sc" x="214" y="148">67</text><rect className="track" x="246" y="141" width="76" height="4"/><rect className="bar grow grow--l" style={{ "--i": "2.4" } as React.CSSProperties} x="246" y="141" width="50.9" height="4"/><text x="338" y="147">&#10003; ENRICHED</text><rect className="pill" x="406" y="132" width="56" height="20" rx="10"/><text className="pt" x="434" y="145.5" textAnchor="middle">MQL</text><path className="ln ln--faint" d="M0 164H470"/></g>
                  <g className="step" style={{ "--i": "2.7" } as React.CSSProperties}><circle className="ln" cx="16" cy="188" r="15"/><text x="16" y="191.5" textAnchor="middle">TB</text><text className="nm" x="42" y="185">Tom Becker</text><text x="42" y="200">ORCA LOGISTICS</text><text className="sc" x="214" y="194">42</text><rect className="track" x="246" y="187" width="76" height="4"/><rect className="bar grow grow--l" style={{ "--i": "3.1" } as React.CSSProperties} x="246" y="187" width="31.9" height="4"/><text x="338" y="193">&ndash;</text><rect className="pill" x="406" y="178" width="56" height="20" rx="10"/><text className="pt" x="434" y="191.5" textAnchor="middle">LEAD</text><path className="ln ln--faint" d="M0 210H470"/></g>
                  <g className="step" style={{ "--i": "3.4" } as React.CSSProperties}><circle className="ln" cx="16" cy="234" r="15"/><text x="16" y="237.5" textAnchor="middle">IM</text><text className="nm" x="42" y="231">Ines Moreau</text><text x="42" y="246">LUMEN STUDIOS</text><text className="sc" x="214" y="240">18</text><rect className="track" x="246" y="233" width="76" height="4"/><rect className="bar grow grow--l" style={{ "--i": "3.8" } as React.CSSProperties} x="246" y="233" width="13.7" height="4"/><text x="338" y="239">&ndash;</text><rect className="pill" x="406" y="224" width="56" height="20" rx="10"/><text className="pt" x="434" y="237.5" textAnchor="middle">LEAD</text><path className="ln ln--faint" d="M0 256H470"/></g>
                </svg>
                <figcaption className="mono">Enriched by Clay, scored before sales sees it</figcaption>
              </figure>
              <ul className="stats">
                <li><strong data-count="31" data-prefix="+" data-suffix="%" data-manual>+31%</strong><span className="mono">Increase in bottom-funnel conversions</span></li>
                <li><strong data-count="4" data-manual>4</strong><span className="mono">Sources per score: ads, CRM, warehouse, Clay</span></li>
                <li><strong data-count="0" data-manual>0</strong><span className="mono">Leads judged on gut feel</span></li>
              </ul>
            </div>
            <div className="ch__body">
              <p className="figure"><span data-count="22" data-manual>22</span><small>Hours a week back for sales</small></p>
              <div className="ch__copy"><h2>A lead-scoring engine sales actually uses.</h2><p>Automation linking ad platforms, CRM and the data warehouse, with Clay enriching every lead and scoring wired straight into HubSpot via MCP.</p></div>
            </div>
          </div>
        </section>
        <div className="dwell zd" aria-hidden="true"></div>

        <section className="stage zoom" data-tone="signal" data-label="05 / LEMAN">
          <div className="word" aria-hidden="true" style={{ "--chars": "8", "--ox": "50%" } as React.CSSProperties}><span>Pipeline</span></div>
          <div className="stage__in detail">
            <div className="head head--client"><p className="client"><span className="sq" aria-hidden="true"></span>LEMAN</p><p className="mono">05 &middot; HubSpot funnel &middot; 2025</p></div>
            <div className="ch__mid">
              <figure className="art">
                <svg viewBox="0 0 420 280" preserveAspectRatio="xMinYMax meet" role="img" aria-label="A sales funnel drawn as stacked shipping containers. The SQL container is three times the size of the quarter before.">
                  <defs><pattern id="corr" width="10" height="48" patternUnits="userSpaceOnUse"><path className="ln ln--faint" d="M5 6V42"/></pattern></defs>
                  <g className="grow" style={{ "--i": "0" } as React.CSSProperties}><rect className="ln" style={{ fill: "url(#corr)" } as React.CSSProperties} x="10" y="10" width="400" height="48"/><text x="24" y="38" className="halo">VISITORS</text></g>
                  <g className="grow" style={{ "--i": "1" } as React.CSSProperties}><rect className="ln" style={{ fill: "url(#corr)" } as React.CSSProperties} x="60" y="72" width="300" height="48"/><text x="74" y="100" className="halo">LEADS</text></g>
                  <g className="grow" style={{ "--i": "2" } as React.CSSProperties}><rect className="ln" style={{ fill: "url(#corr)" } as React.CSSProperties} x="110" y="134" width="200" height="48"/><text x="124" y="162" className="halo">MQLS</text></g>
                  <g className="grow" style={{ "--i": "3" } as React.CSSProperties}><rect className="fill" x="150" y="196" width="120" height="48"/><rect className="ln" style={{ stroke: "var(--bg)", strokeDasharray: "4 3" } as React.CSSProperties} x="190" y="204" width="40" height="32"/></g>
                  <g className="step" style={{ "--i": "4.2" } as React.CSSProperties}><text x="282" y="224">SQLS &times;3</text><text x="10" y="272">DASHED: THE QUARTER BEFORE</text></g>
                </svg>
              </figure>
              <ul className="stats">
                <li><strong data-count="4" data-manual>4</strong><span className="mono">Funnel stages rebuilt</span></li>
                <li><strong data-count="1" data-manual>1</strong><span className="mono">Source of truth, finally</span></li>
                <li><strong data-count="0" data-manual>0</strong><span className="mono">Leads left on the dock</span></li>
              </ul>
            </div>
            <div className="ch__body">
              <p className="figure"><span data-count="3" data-suffix="&times;" data-manual>3&times;</span><small>SQLs in a single quarter</small></p>
              <div className="ch__copy"><h2>Attention, turned into pipeline.</h2><p>Nurture, attribution and automated handoffs for LEMAN, whose funnel was leaking leads. Elsewhere, HubSpot and Clay lifted MQL conversion 44%.</p></div>
            </div>
          </div>
        </section>
        <div className="dwell zd" aria-hidden="true"></div>

        <section className="stage zoom" data-tone="light" data-label="References">
          <div className="word" aria-hidden="true" style={{ "--chars": "10", "--ox": "50%" } as React.CSSProperties}><span>References</span></div>
          <div className="stage__in detail">
            <p className="head mono"><span><span className="sq" aria-hidden="true"></span>References</span><span>Humana &middot; Dear Future</span></p>
            <div className="voices">
              <figure className="voice voice--lead"><blockquote>&ldquo;Alex excels at quickly adopting and applying new AI tools in practice&hellip; I can recommend Alex to companies looking for someone with strong competencies in AI and technology!&rdquo;</blockquote><footer><img src="/assets/images/reviews/henrik.jpg" alt="" /><div><strong>Henrik Stenmann</strong><span>CEO, Dear Future</span></div></footer></figure>
              <figure className="voice"><blockquote>&ldquo;Alex always kept an eye out for new features to test and learn with an agile approach. His can-do and get-it-done attitude was certainly an asset to our team&hellip;&rdquo;</blockquote><footer><img src="/assets/images/reviews/jentry.jpg" alt="" /><div><strong>Jentry Theis</strong><span>Marketing Director, Humana</span></div></footer></figure>
              <figure className="voice"><blockquote>&ldquo;Alex approaches challenges in ways that make me think differently, and I&rsquo;m constantly learning from how he navigates complexity.&rdquo;</blockquote><footer><img src="/assets/images/reviews/john.jpg" alt="" /><div><strong>John Synnes</strong><span>Lead Data &amp; AI Strategy, Dear Future</span></div></footer></figure>
            </div>
          </div>
        </section>
        <div className="dwell zd" aria-hidden="true"></div>

        <section className="stage zoom" id="notes" data-tone="signal" data-label="Notes">
          <div className="word" aria-hidden="true" style={{ "--chars": "5", "--ox": "50%" } as React.CSSProperties}><span>Notes</span></div>
          <div className="stage__in detail">
            <div className="head head--client"><p className="client"><span className="sq" aria-hidden="true"></span>Notes from the work</p><Link className="mono link" href="/blog">All posts &rarr;</Link></div>
            <ol className="posts">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link href={`/blog/${post.slug}`}>
                    <span className="mono">{formatDate(post.date)}</span>
                    <div><h3>{post.title}</h3>{post.featured && post.excerpt ? <p>{post.excerpt}</p> : null}</div>
                    <span className="mono">{post.category} &middot; {post.readTime}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <div className="dwell zd" aria-hidden="true"></div>

        <section className="stage zoom" id="hire" data-tone="dark" data-label="Hire">
          <div className="word" aria-hidden="true" style={{ "--chars": "5", "--ox": "50%" } as React.CSSProperties}><span>Next<span className="dot">.</span></span></div>
          <div className="stage__in detail">
            <p className="head mono"><span><span className="sq" aria-hidden="true"></span>Now booking</span><span>Freelance &middot; Remote &middot; US time zones</span></p>
            <h2 className="hire__title">Let&rsquo;s make<br />the next one<span className="dot">.</span></h2>
            <div className="hire__grid">
            <form className="form" id="talkForm" action="https://formspree.io/f/mlggeayv" method="POST" noValidate>
              <label className="field"><span className="mono">Name</span><input name="name" autoComplete="name" required /></label>
              <label className="field"><span className="mono">Email</span><input name="email" type="email" autoComplete="email" required /></label>
              <fieldset className="kinds"><legend className="mono">Looking for</legend>
                <label><input type="radio" name="kind" value="Sprint" defaultChecked /><span>Sprint</span></label>
                <label><input type="radio" name="kind" value="Retainer" /><span>Retainer</span></label>
                <label><input type="radio" name="kind" value="Fractional" /><span>Fractional</span></label>
                <label><input type="radio" name="kind" value="Full-time freelance" /><span>Full-time freelance</span></label>
              </fieldset>
              <label className="field field--wide"><span className="mono">Your thoughts</span><textarea name="message" rows={2} required placeholder="What are you launching, and when?"></textarea></label>
              <div className="send"><button className="btn btn--solid" type="submit">Send <span aria-hidden="true">&rarr;</span></button><p className="status mono" id="formStatus" role="status"></p></div>
            </form>
            <div className="hire__side">
            <ul className="engage">
              <li><strong>Sprint</strong><span>A launch, a campaign or a funnel rebuild, scoped and shipped in weeks.</span></li>
              <li><strong>Retainer</strong><span>Ongoing paid social, content strategy and reporting for your team.</span></li>
              <li><strong>Fractional</strong><span>A senior growth or MarTech lead, part-time, inside your Slack.</span></li>
            </ul>
            <div className="reach">
              <p className="email" id="email">alexdamore2@gmail.com</p>
              <button className="btn" type="button" data-copy="email">Copy email</button>
              <a className="link" href="https://www.linkedin.com/in/alexdamore/" target="_blank" rel="noopener">LinkedIn &#8599;</a>
            </div>
            </div>
            </div>
            <p className="foot mono"><span>&copy; 2026 Alexander D&rsquo;Amore</span><span>Copenhagen 55.68&deg; N</span></p>
          </div>
        </section>
      </main>
    </div>
  );
}
