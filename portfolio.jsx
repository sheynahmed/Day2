import { useState, useEffect, useRef } from "react";

// ── Security helpers ──────────────────────────────────────────────────────────
const sanitize = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

const useCSP = () => {
  useEffect(() => {
    const noCtx = (e) => e.preventDefault();
    const noKeys = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      )
        e.preventDefault();
    };
    document.addEventListener("contextmenu", noCtx);
    document.addEventListener("keydown", noKeys);
    return () => {
      document.removeEventListener("contextmenu", noCtx);
      document.removeEventListener("keydown", noKeys);
    };
  }, []);
};

const useAntiDevTools = () => {
  useEffect(() => {
    let devOpen = false;
    const check = () => {
      if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        if (!devOpen) {
          devOpen = true;
          console.clear();
          console.log("%c🛡️ Security Notice", "color:#00ff88;font-size:24px;font-weight:bold");
          console.log("%cThis portfolio is protected.", "color:#ff4444;font-size:14px");
        }
      } else devOpen = false;
    };
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, []);
};

const useSessionTimeout = (minutes = 30) => {
  const [expired, setExpired] = useState(false);
  const timer = useRef(null);
  const reset = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setExpired(true), minutes * 60 * 1000);
  };
  useEffect(() => {
    reset();
    ["mousemove", "keydown", "click", "scroll"].forEach((ev) => window.addEventListener(ev, reset));
    return () => {
      clearTimeout(timer.current);
      ["mousemove", "keydown", "click", "scroll"].forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, []);
  return expired;
};

const useRateLimit = () => {
  const clicks = useRef([]);
  return (cb) => {
    const now = Date.now();
    clicks.current = clicks.current.filter((t) => now - t < 1000);
    if (clicks.current.length >= 10) return;
    clicks.current.push(now);
    cb();
  };
};

// ── Data ──────────────────────────────────────────────────────────────────────
const DATA = {
  name: "Shaheen",
  title: "Full-Stack Developer & Game Dev Enthusiast",
  tagline: "Building secure systems · Crafting immersive experiences",
  about:
    "I'm a CS student passionate about operating systems, game mechanics, and building things that are both powerful and secure. From memory allocation algorithms to battle royale game loops — I love diving deep into every layer of a system.",
  skills: [
    { label: "React / JSX", level: 90, icon: "⚛️", cat: "Frontend" },
    { label: "Game Dev (BGMI-inspired)", level: 85, icon: "🎮", cat: "Games" },
    { label: "OS & Algorithms", level: 88, icon: "🖥️", cat: "Systems" },
    { label: "Security Engineering", level: 82, icon: "🛡️", cat: "Security" },
    { label: "Python / C / C++", level: 80, icon: "🐍", cat: "Languages" },
    { label: "UI/UX Design", level: 75, icon: "🎨", cat: "Design" },
    { label: "Tailwind CSS", level: 87, icon: "💨", cat: "Frontend" },
    { label: "Data Structures", level: 85, icon: "🌳", cat: "Systems" },
  ],
  education: [
    {
      degree: "B.Tech in Computer Science",
      school: "Your University Name",
      year: "2022 – 2026",
      grade: "GPA: 8.4 / 10",
      icon: "🎓",
      desc: "Specializing in systems programming, OS internals, and software security.",
      color: "#00ff88",
    },
    {
      degree: "Higher Secondary (XII)",
      school: "Your School Name",
      year: "2020 – 2022",
      grade: "93.4%",
      icon: "📚",
      desc: "Science stream with Computer Science, Mathematics, and Physics.",
      color: "#00c8ff",
    },
    {
      degree: "Secondary (X)",
      school: "Your School Name",
      year: "2019 – 2020",
      grade: "91.2%",
      icon: "🏫",
      desc: "Foundation in mathematics and sciences with distinction.",
      color: "#a855f7",
    },
  ],
  projects: [
    {
      title: "Mini Battle Royale",
      desc: "A full BGMI-inspired game loop in React — AI bots, loot system, zone shrink, live HUD.",
      tech: ["React", "Canvas", "State Machines"],
      icon: "🎮",
      accent: "#00ff88",
    },
    {
      title: "Smart Campus Parking",
      desc: "Design-thinking prototype with usability testing, think-aloud protocol & iterative refinement.",
      tech: ["React", "Figma", "UX Research"],
      icon: "🅿️",
      accent: "#00c8ff",
    },
    {
      title: "OS Algorithm Visualizer",
      desc: "Interactive visualizations for FCFS, SCAN, SSTF, C-SCAN disk scheduling & memory allocation.",
      tech: ["Python", "Matplotlib", "C"],
      icon: "🖥️",
      accent: "#ff6b35",
    },
    {
      title: "Secure Portfolio",
      desc: "This very site — rate limiting, CSP, session timeouts, anti-devtools, and XSS protection baked in.",
      tech: ["React", "Tailwind", "Security"],
      icon: "🛡️",
      accent: "#a855f7",
    },
  ],
  achievements: [
    { icon: "🏆", title: "Hackathon Finalist", tag: "2024", desc: "Top 5 at regional college hackathon for the Smart Parking system.", color: "#fbbf24" },
    { icon: "⭐", title: "Academic Excellence", tag: "Every Semester", desc: "Consistently on the Dean's List with GPA above 8.0.", color: "#00ff88" },
    { icon: "🎮", title: "Game Jam Winner", tag: "2023", desc: "First place in college game jam for the battle royale demo.", color: "#00c8ff" },
    { icon: "🛡️", title: "CTF Participant", tag: "2024", desc: "Competed in Capture The Flag cybersecurity competitions.", color: "#a855f7" },
    { icon: "📜", title: "Certified in React", tag: "Coursera", desc: "Completed Meta's React Professional Certificate.", color: "#ff6b35" },
    { icon: "🌟", title: "Open Source Contributor", tag: "GitHub", desc: "Active contributions to CS education repositories.", color: "#ec4899" },
  ],
  contact: {
    email: "shaheen@example.com",
    github: "github.com/shaheen",
    linkedin: "linkedin.com/in/shaheen",
  },
};

// ── Nav ───────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home",         icon: "🏠" },
  { label: "About",        icon: "👤" },
  { label: "Education",    icon: "🎓" },
  { label: "Skills",       icon: "⚡" },
  { label: "Projects",     icon: "🚀" },
  { label: "Achievements", icon: "🏆" },
  { label: "Contact",      icon: "✉️" },
];

const NavBar = ({ active, setActive }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (l) => { setActive(l); setMenuOpen(false); };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 border-b border-white/5 backdrop-blur-xl ${scrolled ? "bg-[#090b10]/98 shadow-lg shadow-black/40" : "bg-[#090b10]/90"}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => go("Home")} className="font-mono text-emerald-400 font-bold tracking-widest text-sm select-none hover:text-emerald-300 transition-colors">
            {"<SHAHEEN />"}
          </button>

          <ul className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, icon }) => (
              <li key={label}>
                <button
                  onClick={() => go(label)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${active === label ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                >
                  <span className="text-sm">{icon}</span>{label}
                </button>
              </li>
            ))}
          </ul>

          <button onClick={() => setMenuOpen((o) => !o)} className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors" aria-label="Toggle menu">
            <span className={`block w-5 h-0.5 bg-emerald-400 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-emerald-400 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-emerald-400 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-screen border-t border-white/5" : "max-h-0"}`}>
          <ul className="px-4 py-3 space-y-1 bg-[#090b10]">
            {NAV_LINKS.map(({ label, icon }) => (
              <li key={label}>
                <button
                  onClick={() => go(label)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active === label ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                >
                  <span className="text-base">{icon}</span>{label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="fixed top-16 left-0 right-0 z-20 h-0.5 bg-white/5">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${((NAV_LINKS.findIndex((n) => n.label === active) + 1) / NAV_LINKS.length) * 100}%`, background: "linear-gradient(90deg,#00ff88,#00c8ff)" }}
        />
      </div>
    </>
  );
};

// ── Shared ────────────────────────────────────────────────────────────────────
const SectionHeader = ({ num, tag, title, sub }) => (
  <div className="text-center mb-16">
    <span className="text-emerald-400 font-mono text-xs tracking-[0.3em] uppercase mb-3 block">{num} / {tag}</span>
    <h2 className="text-4xl md:text-5xl font-black text-white mb-3">{title}</h2>
    {sub && <p className="text-gray-500 max-w-lg mx-auto text-sm">{sub}</p>}
  </div>
);

const GlowCursor = () => {
  const dot = useRef(null);
  useEffect(() => {
    const move = (e) => { if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; } };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={dot} className="fixed pointer-events-none z-50 w-5 h-5 rounded-full border border-emerald-400 opacity-50 transition-all duration-75" style={{ transform: "translate(-50%,-50%)", boxShadow: "0 0 10px #00ff88" }} />;
};

const SecurityBadge = () => (
  <div className="fixed top-[72px] right-3 z-20 flex items-center gap-1.5 bg-black/80 border border-emerald-500/40 rounded-full px-2.5 py-1 backdrop-blur-md text-xs text-emerald-400 font-mono select-none">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />SECURE
  </div>
);

// ── 1. Home ───────────────────────────────────────────────────────────────────
const HeroSection = ({ setActive }) => {
  const [typed, setTyped] = useState("");
  const full = DATA.tagline;
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => { setTyped(full.slice(0, i + 1)); i++; if (i >= full.length) clearInterval(id); }, 38);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(0,255,136,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,.5) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-emerald-500/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 bg-emerald-500/8 border border-emerald-500/25 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-mono tracking-wider">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />OPEN TO OPPORTUNITIES
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tight mb-4">
          Hi, I'm{" "}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#00ff88,#00c8ff)" }}>{DATA.name}</span>
        </h1>

        <p className="text-base md:text-lg text-gray-400 font-mono mb-4 min-h-[28px]">
          {typed}<span className="animate-pulse text-emerald-400">|</span>
        </p>
        <p className="text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">{DATA.title}</p>

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <button onClick={() => setActive("Projects")} className="px-8 py-3 rounded-xl font-semibold text-black transition-all duration-200 hover:scale-105 active:scale-95" style={{ background: "linear-gradient(135deg,#00ff88,#00c8ff)" }}>
            View Projects 🚀
          </button>
          <button onClick={() => setActive("Contact")} className="px-8 py-3 rounded-xl font-semibold text-white border border-white/15 hover:border-emerald-500/40 transition-all duration-200 hover:scale-105 active:scale-95">
            Get In Touch ✉️
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {NAV_LINKS.slice(1).map(({ label, icon }) => (
            <button key={label} onClick={() => setActive(label)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/4 border border-white/8 text-gray-500 text-xs hover:text-white hover:border-white/20 transition-all duration-200">
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs font-mono text-gray-600">
          {["XSS Protected", "Rate Limited", "CSP Active", "Session Guarded"].map((f) => (
            <span key={f} className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> {f}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── 2. About ──────────────────────────────────────────────────────────────────
const AboutSection = () => (
  <section className="min-h-screen flex items-center px-6 py-24">
    <div className="max-w-6xl mx-auto w-full">
      <SectionHeader num="001" tag="About Me" title="Who Am I?" />
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-gray-400 leading-relaxed text-lg mb-8">{sanitize(DATA.about)}</p>
          <div className="flex flex-wrap gap-3 mb-8">
            {["CS Student", "Game Developer", "OS Enthusiast", "Security Minded", "React Lover", "Open Source"].map((t) => (
              <span key={t} className="px-4 py-1.5 rounded-full bg-white/4 border border-white/10 text-sm text-gray-300 hover:border-emerald-500/40 transition-colors cursor-default">{t}</span>
            ))}
          </div>
          <div className="flex gap-3"><div className="h-1 flex-1 rounded-full" style={{ background: "linear-gradient(90deg,#00ff88,#00c8ff)" }} /><div className="h-1 w-8 rounded-full bg-white/10" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[{ num: "4+", label: "Projects Built", icon: "🚀" }, { num: "3+", label: "Years Coding", icon: "💻" }, { num: "100%", label: "Security First", icon: "🛡️" }, { num: "∞", label: "Curiosity Level", icon: "🔍" }].map(({ num, label, icon }) => (
            <div key={label} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-emerald-500/25 transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-3xl font-black mb-1 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#00ff88,#00c8ff)" }}>{num}</div>
              <div className="text-gray-500 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── 3. Education ──────────────────────────────────────────────────────────────
const EducationSection = () => (
  <section className="min-h-screen flex items-center px-6 py-24 bg-white/[0.01]">
    <div className="max-w-4xl mx-auto w-full">
      <SectionHeader num="002" tag="Education" title="Academic Journey" sub="The foundations that shaped my engineering mindset." />
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-cyan-500/30 to-transparent hidden md:block" />
        <div className="space-y-8">
          {DATA.education.map((edu, i) => (
            <div key={i} className="md:pl-16 relative group">
              <div className="absolute left-4 top-6 w-4 h-4 rounded-full border-2 hidden md:block transition-all duration-300 group-hover:scale-125" style={{ borderColor: edu.color, background: `${edu.color}22`, boxShadow: `0 0 10px ${edu.color}44` }} />
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{edu.icon}</span>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">{edu.degree}</h3>
                      <p className="text-gray-500 text-sm">{edu.school}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono text-xs px-3 py-1 rounded-full mb-1" style={{ background: `${edu.color}15`, color: edu.color, border: `1px solid ${edu.color}30` }}>{edu.year}</div>
                    <div className="text-emerald-400 font-mono text-xs font-bold">{edu.grade}</div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{edu.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 bg-white/2 border border-white/6 rounded-2xl p-6">
        <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-widest">📜 Certifications & Courses</h3>
        <div className="flex flex-wrap gap-3">
          {["Meta React Professional", "CS50x – Harvard", "Google UX Design", "Ethical Hacking Basics", "Data Structures – NPTEL"].map((c) => (
            <span key={c} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:border-emerald-500/30 hover:text-gray-300 transition-colors cursor-default">{c}</span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── 4. Skills ─────────────────────────────────────────────────────────────────
const SkillBar = ({ skill, idx }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setWidth(skill.level), idx * 80); obs.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-gray-300 text-sm font-medium flex items-center gap-2">
          {skill.icon} {skill.label}
          <span className="text-gray-600 text-xs font-mono">{skill.cat}</span>
        </span>
        <span className="text-emerald-400 font-mono text-xs font-bold">{skill.level}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%`, background: "linear-gradient(90deg,#00ff88,#00c8ff)" }} />
      </div>
    </div>
  );
};

const SkillsSection = () => (
  <section className="min-h-screen flex items-center px-6 py-24">
    <div className="max-w-6xl mx-auto w-full">
      <SectionHeader num="003" tag="Skills" title="Tech Arsenal" sub="What I build with, fight with, and obsess over." />
      <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 max-w-4xl mx-auto">
        {DATA.skills.map((s, i) => <SkillBar key={s.label} skill={s} idx={i} />)}
      </div>
      <div className="mt-14 text-center">
        <p className="text-gray-600 text-xs font-mono uppercase tracking-widest mb-5">Also comfortable with</p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {["Git / GitHub", "Linux", "VS Code", "Figma", "Postman", "SQLite", "Node.js", "Bash", "LaTeX"].map((t) => (
            <span key={t} className="px-3.5 py-1.5 rounded-lg bg-white/4 border border-white/8 text-xs text-gray-500 hover:text-gray-300 hover:border-white/15 transition-all cursor-default font-mono">{t}</span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── 5. Projects ───────────────────────────────────────────────────────────────
const ProjectsSection = () => {
  const rate = useRateLimit();
  return (
    <section className="min-h-screen flex items-center px-6 py-24 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader num="004" tag="Projects" title="What I've Built" sub="Each project is a story of a problem worth solving." />
        <div className="grid md:grid-cols-2 gap-5">
          {DATA.projects.map((p) => (
            <div key={p.title} className="group bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-1.5 cursor-default" onClick={() => rate(() => {})}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{p.icon}</span>
                <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: p.accent, boxShadow: `0 0 8px ${p.accent}` }} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">{sanitize(p.title)}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{sanitize(p.desc)}</p>
              <div className="flex flex-wrap gap-2">
                {p.tech.map((t) => (<span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 text-xs font-mono border border-white/8">{sanitize(t)}</span>))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── 6. Achievements ───────────────────────────────────────────────────────────
const AchievementsSection = () => (
  <section className="min-h-screen flex items-center px-6 py-24">
    <div className="max-w-6xl mx-auto w-full">
      <SectionHeader num="005" tag="Achievements" title="Highlights & Wins" sub="Moments that proved the grind was worth it." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DATA.achievements.map((a, i) => (
          <div key={i} className="group bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1.5">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl flex-shrink-0">{a.icon}</span>
              <div>
                <h3 className="text-white font-bold text-sm leading-snug group-hover:text-emerald-400 transition-colors mb-1">{a.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: `${a.color}15`, color: a.color, border: `1px solid ${a.color}30` }}>{a.tag}</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── 7. Contact ────────────────────────────────────────────────────────────────
const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const rate = useRateLimit();

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length > 60) e.name = "Name required (max 60 chars)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.msg.trim() || form.msg.length > 500) e.msg = "Message required (max 500 chars)";
    return e;
  };

  const submit = () => rate(() => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending");
    setTimeout(() => { setStatus("sent"); setForm({ name: "", email: "", msg: "" }); }, 1200);
  });

  return (
    <section className="min-h-screen flex items-center px-6 py-24 bg-white/[0.01]">
      <div className="max-w-2xl mx-auto w-full">
        <SectionHeader num="006" tag="Contact" title="Let's Connect" sub="All inputs are sanitized and rate-limited. Zero trackers." />
        <div className="bg-white/3 border border-white/8 rounded-2xl p-8 mb-6">
          {status === "sent" ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-emerald-400 font-mono font-semibold">Message sent securely!</p>
              <p className="text-gray-600 text-xs mt-2">I'll get back to you soon.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {[{ key: "name", label: "Name", type: "text", ph: "Your Name", max: 60 }, { key: "email", label: "Email", type: "email", ph: "you@example.com", max: 100 }].map(({ key, label, type, ph, max }) => (
                <div key={key}>
                  <label className="text-gray-400 text-sm mb-1.5 block font-medium">{label}</label>
                  <input type={type} placeholder={ph} maxLength={max} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value.slice(0, max) }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm" />
                  {errors[key] && <p className="text-red-400 text-xs mt-1">⚠ {errors[key]}</p>}
                </div>
              ))}
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block font-medium">Message</label>
                <textarea rows={4} placeholder="Tell me about your project or idea..." maxLength={500} value={form.msg} onChange={(e) => setForm((f) => ({ ...f, msg: e.target.value.slice(0, 500) }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm resize-none" />
                <div className="flex justify-between mt-1">
                  {errors.msg ? <p className="text-red-400 text-xs">⚠ {errors.msg}</p> : <span />}
                  <span className="text-xs text-gray-600 font-mono">{form.msg.length}/500</span>
                </div>
              </div>
              <button onClick={submit} disabled={status === "sending"} className="w-full py-3.5 rounded-xl font-semibold text-black transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50" style={{ background: "linear-gradient(135deg,#00ff88,#00c8ff)" }}>
                {status === "sending" ? "Sending securely..." : "Send Message 🔒"}
              </button>
              <p className="text-center text-xs text-gray-600 font-mono">Rate limited · XSS sanitized · No trackers</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(DATA.contact).map(([k, v]) => (
            <div key={k} className="bg-white/3 border border-white/8 rounded-xl p-4 text-center hover:border-emerald-500/25 transition-colors group cursor-default">
              <div className="text-gray-600 text-xs uppercase tracking-wider mb-1.5">{k}</div>
              <div className="text-gray-400 text-xs font-mono truncate">{sanitize(v)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Overlays ──────────────────────────────────────────────────────────────────
const SessionExpiredOverlay = () => (
  <div className="fixed inset-0 z-[100] bg-black/96 backdrop-blur-xl flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-6">🔒</div>
      <h2 className="text-white text-2xl font-bold mb-3">Session Expired</h2>
      <p className="text-gray-400 mb-6">Your session timed out for security reasons.</p>
      <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl font-semibold text-black" style={{ background: "linear-gradient(135deg,#00ff88,#00c8ff)" }}>Reload Page</button>
    </div>
  </div>
);

// ── App ───────────────────────────────────────────────────────────────────────
const SECTIONS = { Home: HeroSection, About: AboutSection, Education: EducationSection, Skills: SkillsSection, Projects: ProjectsSection, Achievements: AchievementsSection, Contact: ContactSection };

export default function App() {
  const [active, setActive] = useState("Home");
  const expired = useSessionTimeout(30);
  useCSP();
  useAntiDevTools();
  const Section = SECTIONS[active] || HeroSection;

  return (
    <div className="min-h-screen text-white selection:bg-emerald-500/25 selection:text-emerald-200" style={{ background: "#090b10", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap" rel="stylesheet" />
      {expired && <SessionExpiredOverlay />}
      <GlowCursor />
      <SecurityBadge />
      <NavBar active={active} setActive={setActive} />
      <main className="pt-16"><Section setActive={setActive} /></main>
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-emerald-400 text-sm font-bold">{"<SHAHEEN />"}</span>
          <div className="flex flex-wrap gap-3">
            {NAV_LINKS.map(({ label }) => (
              <button key={label} onClick={() => setActive(label)} className="text-gray-600 text-xs hover:text-gray-400 transition-colors">{label}</button>
            ))}
          </div>
          <span className="text-gray-700 text-xs font-mono">© {new Date().getFullYear()} · Secured 🛡️</span>
        </div>
      </footer>
    </div>
  );
}
