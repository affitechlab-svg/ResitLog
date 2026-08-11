"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type VarianButang = "utama" | "ink" | "garis";

interface PropsButang
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  varian?: VarianButang;
  tinggi?: number;
  lebarPenuh?: boolean;
  ikon?: ReactNode;
  className?: string;
  children: ReactNode;
}

// Keadaan hover/tekan ikut CLAUDE.md §1.2. Varian "ink" tiada token hover/tekan
// khusus dalam dokumen — guna opacity supaya tetap konsisten tanpa reka warna baru.
const GAYA_VARIAN: Record<VarianButang, string> = {
  utama: "bg-maroon text-ground hover:bg-maroon-hover active:bg-maroon-pressed",
  ink: "bg-ink text-ground hover:opacity-90 active:opacity-80",
  garis: "border-2 border-ink bg-transparent text-ink hover:bg-ink/[0.07] active:bg-ink/[0.14]",
};

export default function Butang({
  varian = "utama",
  tinggi = 56,
  lebarPenuh = true,
  ikon,
  className = "",
  children,
  disabled,
  ...selebihnya
}: PropsButang) {
  return (
    <button
      {...selebihnya}
      disabled={disabled}
      style={{ height: tinggi }}
      className={`flex items-center gap-3.5 px-5 text-left font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-[0.45] ${
        lebarPenuh ? "w-full" : ""
      } ${GAYA_VARIAN[varian]} ${className}`}
    >
      {ikon}
      <span className="flex-1">{children}</span>
    </button>
  );
}
