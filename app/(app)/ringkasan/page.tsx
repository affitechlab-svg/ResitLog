"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { BlokPoster, SegmentedControl, KeadaanKosong, Butang } from "@/komponen/ui";
import { useDataResit } from "@/lib/konteks-data";
import { bulanTerkiniData, ringkasanBulan, pecahanKategoriBulan } from "@/lib/data";
import { formatRM, labelBulanTahun, bulanSebelum, namaBulan } from "@/lib/format";

const PENAFIAN_CUKAI =
  "ResitLog memaparkan jumlah belanja sahaja. Ia tidak mengira had pelepasan cukai dan bukan nasihat cukai. Sila rujuk LHDN atau ejen cukai anda.";

function TeksPerbandingan({ jumlahIni, jumlahLepas, namaBulanLepas }: { jumlahIni: number; jumlahLepas: number; namaBulanLepas: string }) {
  if (jumlahLepas === 0) return <>Tiada rekod pada {namaBulanLepas} untuk dibandingkan</>;
  const beza = jumlahIni - jumlahLepas;
  if (beza === 0) return <>Sama seperti {namaBulanLepas}</>;
  const arah = beza > 0 ? "naik" : "turun";
  return (
    <>
      {arah} {formatRM(Math.abs(beza))} daripada {namaBulanLepas}
    </>
  );
}

export default function HalamanRingkasan() {
  const { pengguna, senaraiResit } = useDataResit();
  const [mod, setMod] = useState<"bulanan" | "tahunan">("bulanan");

  const kunciBulan = bulanTerkiniData(senaraiResit);
  const { jumlah, bilanganResit } = ringkasanBulan(senaraiResit, kunciBulan);
  const kunciBulanLepas = bulanSebelum(kunciBulan);
  const jumlahBulanLepas = ringkasanBulan(senaraiResit, kunciBulanLepas).jumlah;
  const namaBulanLepas = namaBulan(Number(kunciBulanLepas.slice(5, 7)) - 1);
  const pecahan = pecahanKategoriBulan(senaraiResit, kunciBulan);

  const adalahPremium = pengguna.pakej === "premium";

  return (
    <div className="flex flex-col">
      <div className="border-b-2 border-ink px-5 py-3">
        <div className="text-2xl font-extrabold tracking-tight">Ringkasan</div>
        <SegmentedControl
          className="mt-3"
          warnaAktif="ink"
          nilaiTerpilih={mod}
          onUbah={(n) => setMod(n as "bulanan" | "tahunan")}
          opsyen={[
            { nilai: "bulanan", label: "Bulanan" },
            { nilai: "tahunan", label: "Tahunan", dikunci: !adalahPremium },
          ]}
        />
      </div>

      {mod === "tahunan" && !adalahPremium ? (
        <div className="m-5 border-2 border-maroon bg-maroon-tint p-5">
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-maroon">
            <Lock size={14} strokeWidth={2} />
            Premium
          </div>
          <h2 className="mt-2 text-xl font-extrabold leading-tight">Ringkasan tahunan ikut kategori</h2>
          <p className="mt-1.5 text-[13px] text-on-tint">
            Untuk rujukan cukai. Termasuk eksport Excel.
          </p>
          <Butang varian="utama" tinggi={44} lebarPenuh={false} className="mt-3">
            Naik Premium
          </Butang>
        </div>
      ) : mod === "tahunan" ? (
        <KeadaanKosong
          tajuk="Ringkasan tahunan"
          mesej="Ciri ini akan disediakan pada Fasa 8 (Premium)."
        />
      ) : (
        <>
          <BlokPoster
            label={labelBulanTahun(`${kunciBulan}-01`)}
            nilai={formatRM(jumlah)}
            meta={
              <>
                {bilanganResit} resit ·{" "}
                <TeksPerbandingan jumlahIni={jumlah} jumlahLepas={jumlahBulanLepas} namaBulanLepas={namaBulanLepas} />
              </>
            }
          />

          <div
            className="flex items-center justify-between gap-3 border-b-2 border-ink bg-maroon-tint px-5 py-3 opacity-[0.45]"
            title="Akan dibuka pada Fasa 9"
          >
            <span className="text-sm font-extrabold text-maroon">Dashboard AI Insight</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-maroon">Buka ›</span>
          </div>

          <div className="px-5 pt-3">
            <div className="border-b-2 border-ink pb-2.5 text-[11px] font-semibold uppercase tracking-wider">
              Ikut kategori
            </div>

            {pecahan.length === 0 ? (
              <KeadaanKosong
                tajuk="Belum ada belanja bulan ini"
                mesej="Snap resit atau masuk manual supaya ringkasan kategori muncul di sini."
              />
            ) : (
              <div className="flex flex-col">
                {pecahan.map((p) => (
                  <div key={p.kategori} className="border-b border-hairline py-2.5">
                    <div className="flex justify-between text-[15px]">
                      <span className="font-semibold">{p.nama}</span>
                      <span className="font-extrabold">{formatRM(p.jumlah)}</span>
                    </div>
                    <div className="mt-2 h-2 bg-surface">
                      <div className="h-2 bg-maroon" style={{ width: `${p.peratus}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!adalahPremium && (
              <div className="mt-1 border-2 border-maroon bg-maroon-tint p-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-maroon">Premium</div>
                <div className="mt-1 text-base font-extrabold leading-tight">
                  Ringkasan tahunan ikut kategori
                </div>
                <p className="mt-1 text-xs text-on-tint">Untuk rujukan cukai. Termasuk eksport Excel.</p>
                <Butang varian="utama" tinggi={42} lebarPenuh={false} className="mt-2">
                  Naik Premium
                </Butang>
              </div>
            )}

            <p className="py-3 text-[11px] leading-relaxed text-muted">{PENAFIAN_CUKAI}</p>
          </div>
        </>
      )}
    </div>
  );
}
