"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Chip, KeadaanKosong } from "@/komponen/ui";
import { useDataResit } from "@/lib/konteks-data";
import { kumpulanIkutBulan } from "@/lib/data";
import { formatRM, formatTarikh } from "@/lib/format";
import { namaKategori, type KodKategori } from "@/lib/kategori";
import type { ResitPenuh } from "@/jenis";

const BILANGAN_CHIP_KATEGORI_MAKS = 2;

function kategoriUnikResit(resit: ResitPenuh): KodKategori[] {
  return [...new Set(resit.item.map((i) => i.kategori))];
}

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
            <div className="flex items-baseline justify-between bg-surface px-5 py-3 border-b border-hairline">
              <span className="text-xs font-extrabold uppercase tracking-wider">{bulan.label}</span>
              <span className="text-[13px] font-extrabold">{formatRM(bulan.jumlah)}</span>
            </div>
            <div className="flex flex-col">
              {bulan.resit.map((r) => {
                const kategori = kategoriUnikResit(r);
                const kategoriDipapar = kategori.slice(0, BILANGAN_CHIP_KATEGORI_MAKS);
                const bakiKategori = kategori.length - kategoriDipapar.length;

                return (
                  <Link
                    key={r.id}
                    href={`/rekod/${r.id}`}
                    className="flex justify-between gap-3 border-b border-hairline px-5 py-3.5"
                  >
                    <div>
                      <div className="text-base font-semibold text-ink">{r.kedai}</div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {kategoriDipapar.map((k) => (
                          <Chip key={k} varian="tint" className="px-[7px] py-[3px] text-[11px]">
                            {namaKategori(k)}
                          </Chip>
                        ))}
                        {bakiKategori > 0 && (
                          <Chip varian="tint" className="px-[7px] py-[3px] text-[11px]">
                            +{bakiKategori}
                          </Chip>
                        )}
                        {r.tiadaBukti && (
                          <Chip
                            varian="garis"
                            className="border-maroon px-[6px] py-[2px] text-[11px] text-maroon"
                          >
                            Tiada bukti
                          </Chip>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-base font-extrabold text-ink">{formatRM(r.jumlah)}</div>
                      <div className="mt-1 text-xs text-muted">{formatTarikh(r.tarikh)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
