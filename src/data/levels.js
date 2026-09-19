// Roadmap levels (course modules)
export const LEVELS = [
  { id: 1, key: "fundamental", name: "Forex Fundamental", tag: "LEVEL 1", built: true, premium: false },
  { id: 2, key: "chart", name: "Membaca Chart", tag: "LEVEL 2", built: true, premium: false },
  { id: 3, key: "technical", name: "Analisis Teknikal", tag: "LEVEL 3", built: true, premium: false },
  { id: 4, key: "risk", name: "Risk Management", tag: "LEVEL 4", built: true, premium: true },
  { id: 5, key: "psychology", name: "Trading Psychology", tag: "LEVEL 5", built: true, premium: false },
  { id: 6, key: "simulation", name: "Simulasi & Praktik", tag: "LEVEL 6", built: true, premium: false },
  { id: 7, key: "simulator", name: "Trading Simulator", tag: "LEVEL 7", built: true, premium: false, linkTo: "/simulator" },
];

export const DEFAULT_PROGRESS = {
  fundamental: 0,
  chart: 0,
  technical: 0,
  risk: 0,
  psychology: 0,
};

// XP -> user level name (gamification layer, separate from course levels above)
export const XP_LEVEL_NAMES = [
  "Forex Beginner",
  "Chart Explorer",
  "Technical Learner",
  "Risk Manager",
  "Trading Planner",
  "Disciplined Learner",
  "Forex Scholar",
];

export const XP_PER_LEVEL = 300;

export function xpToLevel(xp) {
  const idx = Math.min(XP_LEVEL_NAMES.length - 1, Math.floor(xp / XP_PER_LEVEL));
  return { level: idx + 1, levelName: XP_LEVEL_NAMES[idx] };
}
