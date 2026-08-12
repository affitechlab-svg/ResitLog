"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { KeadaanKosong } from "@/komponen/ui";
import BarisResit from "@/komponen/resit/BarisResit";
import { useDataResit } from "@/lib/konteks-data";
import { kumpulanIkutBulan } from "@/lib/data";
import { formatRM } from "@/lib/format";

export default function HalamanRekod() {
  const { senaraiResit } = useDataResit();
  const [carian, setCarian] = useState("");

  const senaraiDitapis = useMemo(() => {
    const suku = carian.trim().toLowerCase();
    if (!suku) return senaraiResit;
    return senaraiResit.filter((r) => r.kedai.toLowerCase().includes(suku));
  }, [senaraiResit, carian]);

  const kumpulan = useMemo(() => kumpulanIkutBulan(senaraiDitapis), [senaraiDitapis]);

  return (
    <div className="flex flex-col">
      <div className="border-b-2 border-ink px-5 py-3">
        <div className="text-2xl font-extrabold tracking-tight">Rekod</div>
        <div className="mt-3 flex h-[46px] items-center gap-2.5 border-2 border-ink bg-white px-3">
          <Search size={18} strokeWidth={2} className="text-muted" />
          <input
            value={carian}
            onChange={(e) => setCarian(e.target.value)}
            placeholder="Cari nama kedai"
            aria-label="Cari nama kedai"
            className="w-full bg-transparent text-[15px] text-ink placeholder:text-disabled focus:outline-none"
          />
        </div>
      </div>

      {senaraiResit.length === 0 ? (
        <KeadaanKosong
          tajuk="Belum ada rekod"
          mesej="Snap resit pertama anda atau masuk manual untuk mula rekod belanja."
        />
      ) : kumpulan.length === 0 ? (
        <KeadaanKosong
          tajuk="Tiada hasil carian"
          mesej={`Tiada kedai sepadan dengan "${carian}". Cuba kata kunci lain.`}
        />
      ) : (
        kumpulan.map((bulan) => (
          <div key={bulan.kunciBulan}>
            <div className="flex items-baseline justify-between border-b border-hairline bg-surface px-5 py-3">
              <span className="text-xs font-extrabold uppercase tracking-wider">{bulan.label}</span>
              <span className="text-[13px] font-extrabold">{formatRM(bulan.jumlah)}</span>
            </div>
            <div className="flex flex-col px-5">
              {bulan.resit.map((r) => (
                <BarisResit key={r.id} resit={r} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
