export interface Accent {
  name: string;
  label: string;
  brand: string;
  brand2: string;
  soft: string;
}

export const ACCENTS: Accent[] = [
  { name: "amber", label: "Amber", brand: "#eab308", brand2: "#ca9a04", soft: "rgba(234, 179, 8, 0.16)" },
  { name: "teal", label: "Teal", brand: "#14b8a6", brand2: "#0d9488", soft: "rgba(20, 184, 166, 0.12)" },
  { name: "blue", label: "Blue", brand: "#3b82f6", brand2: "#2563eb", soft: "rgba(59, 130, 246, 0.12)" },
  { name: "indigo", label: "Indigo", brand: "#4f46e5", brand2: "#4338ca", soft: "rgba(79, 70, 229, 0.12)" },
  { name: "purple", label: "Purple", brand: "#8b5cf6", brand2: "#7c3aed", soft: "rgba(139, 92, 246, 0.12)" },
  { name: "green", label: "Green", brand: "#10b981", brand2: "#059669", soft: "rgba(16, 185, 129, 0.12)" },
  { name: "orange", label: "Orange", brand: "#f97316", brand2: "#ea580c", soft: "rgba(249, 115, 22, 0.12)" },
  { name: "rose", label: "Rose", brand: "#f43f5e", brand2: "#e11d48", soft: "rgba(244, 63, 94, 0.12)" },
  { name: "slate", label: "Slate", brand: "#64748b", brand2: "#475569", soft: "rgba(100, 116, 139, 0.12)" },
];

export function accentFromHex(hex: string): Accent {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const darken = (v: number) => Math.max(0, Math.round(v * 0.8));
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return {
    name: "custom",
    label: "Custom",
    brand: hex,
    brand2: `#${toHex(darken(r))}${toHex(darken(g))}${toHex(darken(b))}`,
    soft: `rgba(${r}, ${g}, ${b}, 0.12)`,
  };
}

export function applyAccent(accent: Accent) {
  const style = document.documentElement.style;
  style.setProperty("--brand", accent.brand);
  style.setProperty("--brand-2", accent.brand2);
  style.setProperty("--brand-soft", accent.soft);
  try {
    localStorage.setItem("fp-accent-name", accent.name);
    localStorage.setItem(
      "fp-accent",
      JSON.stringify({ brand: accent.brand, brand2: accent.brand2, soft: accent.soft })
    );
  } catch {
    // localStorage unavailable (private mode) — accent still applies for this session
  }
}
