"use client";

import { Lock } from "lucide-react";

interface OpsyenSegmen {
  nilai: string;
  label: string;
  dikunci?: boolean;
}

interface PropsSegmentedControl {
  opsyen: OpsyenSegmen[];
  nilaiTerpilih: string;
  onUbah: (nilai: string) => void;
  // Rujukan reka bentuk guna warna aktif berbeza ikut konteks: maroon untuk
  // Cara Bayar (skrin Semak), ink untuk Bulanan/Tahunan (skrin Ringkasan).
  warnaAktif?: "ink" | "maroon";
  className?: string;
}

export default function SegmentedControl({
  opsyen,
  nilaiTerpilih,
  onUbah,
  warnaAktif = "ink",
  className = "",
}: PropsSegmentedControl) {
  return (
    <div className={`flex border-2 border-ink ${className}`} role="tablist">
      {opsyen.map((o, i) => {
        const aktif = o.nilai === nilaiTerpilih;
        return (
          <button
            key={o.nilai}
            type="button"
            role="tab"
            aria-selected={aktif}
            onClick={() => onUbah(o.nilai)}
            className={`flex flex-1 items-center justify-center gap-1.5 py-[11px] text-[13px] ${
              aktif
                ? `text-ground font-extrabold ${warnaAktif === "maroon" ? "bg-maroon" : "bg-ink"}`
                : "font-semibold text-ink"
            } ${i > 0 ? "border-l-2 border-ink" : ""}`}
          >
            {o.dikunci && <Lock size={14} strokeWidth={2} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
