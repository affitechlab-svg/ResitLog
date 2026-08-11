"use client";

import { useEffect, useId, useState } from "react";
import type { ReactNode } from "react";
import Butang from "@/komponen/ui/Butang";

interface PropsDialog {
  terbuka: boolean;
  tajuk: string;
  mesej: ReactNode;
  labelSahkan: string;
  labelBatal?: string;
  onSahkan: () => void;
  onBatal: () => void;
  // Bila diisi, pengguna mesti taip semula teks ini tepat sebelum butang sahkan aktif.
  // Guna untuk BR-08 (Padam semua data).
  taipUlangTeks?: string;
}

export default function Dialog({
  terbuka,
  tajuk,
  mesej,
  labelSahkan,
  labelBatal = "Batal",
  onSahkan,
  onBatal,
  taipUlangTeks,
}: PropsDialog) {
  const idTajuk = useId();
  const [inputUlang, setInputUlang] = useState("");

  useEffect(() => {
    if (terbuka) setInputUlang("");
  }, [terbuka]);

  if (!terbuka) return null;

  const bolehSahkan = !taipUlangTeks || inputUlang === taipUlangTeks;

  return (
    <div
      role="presentation"
      onClick={onBatal}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={idTajuk}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] border-2 border-ink bg-ground p-5"
      >
        <h2 id={idTajuk} className="text-lg font-extrabold text-ink">
          {tajuk}
        </h2>
        <div className="mt-2 text-sm leading-relaxed text-muted">{mesej}</div>

        {taipUlangTeks && (
          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink">
              Taip semula &quot;{taipUlangTeks}&quot; untuk sahkan
            </span>
            <input
              value={inputUlang}
              onChange={(e) => setInputUlang(e.target.value)}
              className="h-[46px] border-2 border-ink bg-white px-3 text-base font-semibold text-ink"
            />
          </label>
        )}

        <div className="mt-5 flex gap-2.5">
          <Butang varian="garis" tinggi={48} onClick={onBatal}>
            {labelBatal}
          </Butang>
          <Butang varian="utama" tinggi={48} onClick={onSahkan} disabled={!bolehSahkan}>
            {labelSahkan}
          </Butang>
        </div>
      </div>
    </div>
  );
}
