export interface Accent {
  name: string;
  label: string;
  brand: string;
  brand2: string;
  soft: string;
}

export const ACCENTS: Accent[] = [
  { name: "black", label: "Black", brand: "#000000", brand2: "#333333", soft: "rgba(0, 0, 0, 0.06)" },
  { name: "charcoal", label: "Charcoal", brand: "#1a1a1a", brand2: "#404040", soft: "rgba(26, 26, 26, 0.08)" },
  { name: "slate", label: "Slate", brand: "#475569", brand2: "#334155", soft: "rgba(71, 85, 105, 0.1)" },
  { name: "gray", label: "Gray", brand: "#6b7280", brand2: "#4b5563", soft: "rgba(107, 114, 128, 0.1)" },
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
