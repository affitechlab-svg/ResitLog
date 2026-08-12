"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, ChevronRight } from "lucide-react";
import { Butang, Dialog } from "@/komponen/ui";
import { useDataResit } from "@/lib/konteks-data";
import { formatTarikh } from "@/lib/format";

const LABEL_MOD: Record<"solo" | "pasangan", string> = {
  solo: "mod sendiri",
  pasangan: "mod pasangan",
};

function Tajuk({ children }: { children: string }) {
  return (
    <div className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted first:mt-0">
      {children}
    </div>
  );
}

export default function HalamanTetapan() {
  const router = useRouter();
  const { pengguna, senaraiResit, padamSemuaResit } = useDataResit();
  const [dialogPadamTerbuka, setDialogPadamTerbuka] = useState(false);
  const [selesaiDipadam, setSelesaiDipadam] = useState(false);

  const adalahPremium = pengguna.pakej === "premium";

  function sahkanPadam() {
    padamSemuaResit();
    setDialogPadamTerbuka(false);
    setSelesaiDipadam(true);
  }

  return (
    <div className="flex flex-col">
      <div className="border-b-2 border-ink px-5 py-3">
        <div className="text-2xl font-extrabold tracking-tight">Tetapan</div>
      </div>

      <div className="px-5 pb-8 pt-[18px]">
        <Tajuk>Akaun</Tajuk>
        <div className="mt-1.5 flex items-center justify-between border-b border-hairline py-3">
          <div>
            <div className="text-base font-semibold">{pengguna.nama}</div>
            <div className="mt-0.5 text-xs text-muted">
              Mula guna {formatTarikh(pengguna.tarikhMula)} · {LABEL_MOD[pengguna.mod]}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-b-2 border-ink py-3">
          <div>
            <div className="text-base font-semibold">Pakej</div>
            <div className="mt-0.5 text-xs text-muted">
              {adalahPremium ? "Premium — semua ciri dibuka" : "Basic — tanpa had resit"}
            </div>
          </div>
          {!adalahPremium && (
            <Butang varian="utama" tinggi={38} lebarPenuh={false} className="text-xs">
              Naik Premium
            </Butang>
          )}
        </div>

        <Tajuk>Data</Tajuk>
        <div className="mt-1.5 flex items-center justify-between border-b border-hairline py-3">
          <span className="text-base font-semibold">Jumlah rekod</span>
          <span className="text-base font-extrabold">{senaraiResit.length} resit</span>
        </div>
        <div className="flex items-center justify-between border-b border-hairline py-3">
          <div className="flex items-center gap-2">
            <span className={`text-base font-semibold ${!adalahPremium ? "text-disabled" : ""}`}>
              Eksport ke Excel
            </span>
            {!adalahPremium && (
              <span className="bg-maroon px-[7px] py-[3px] text-[10px] font-extrabold uppercase tracking-wider text-ground">
                Premium
              </span>
            )}
          </div>
          {!adalahPremium && <Lock size={18} strokeWidth={2} className="text-disabled" />}
        </div>
        <div className="flex items-center justify-between border-b-2 border-ink py-3">
          <div className="flex items-center gap-2">
            <span className={`text-base font-semibold ${!adalahPremium ? "text-disabled" : ""}`}>
              Mod pasangan
            </span>
            {!adalahPremium && (
              <span className="bg-maroon px-[7px] py-[3px] text-[10px] font-extrabold uppercase tracking-wider text-ground">
                Premium
              </span>
            )}
          </div>
          {!adalahPremium && <Lock size={18} strokeWidth={2} className="text-disabled" />}
        </div>

        <Tajuk>Bantuan</Tajuk>
        <button
          type="button"
          onClick={() => router.push("/pasang")}
          className="mt-1.5 flex w-full items-center justify-between border-b border-hairline py-3 text-left"
        >
          <span className="text-base font-semibold">Tambah ke Skrin Utama</span>
          <ChevronRight size={18} strokeWidth={2} className="text-disabled" />
        </button>
        <div className="flex items-center justify-between border-b border-hairline py-3">
          <span className="text-base font-semibold">Soalan lazim</span>
          <ChevronRight size={18} strokeWidth={2} className="text-disabled" />
        </div>
        <div className="flex items-center justify-between border-b-2 border-ink py-3">
          <span className="text-base font-semibold">Hubungi kami</span>
          <ChevronRight size={18} strokeWidth={2} className="text-disabled" />
        </div>

        <div className="mt-3.5 border-2 border-maroon p-3.5">
          <div className="text-base font-extrabold text-maroon">Padam semua data</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-on-tint">
            Semua resit, item dan gambar akan hilang terus. Tindakan ini tidak boleh dibatalkan.
          </p>
          <Butang
            varian="garis"
            tinggi={44}
            lebarPenuh={false}
            className="mt-3 border-maroon text-maroon"
            onClick={() => setDialogPadamTerbuka(true)}
          >
            Padam semua data
          </Butang>
        </div>
        {selesaiDipadam && (
          <p className="mt-2.5 text-xs font-semibold text-maroon">
            Semua data telah dipadam. Akaun anda kekal.
          </p>
        )}

        <div className="mt-2.5 text-[11px] text-disabled">ResitLog v1.0 · Bahasa Melayu</div>
      </div>

      <Dialog
        terbuka={dialogPadamTerbuka}
        tajuk="Padam semua data?"
        mesej="Semua resit, item dan gambar akan hilang terus. Tindakan ini tidak boleh dibatalkan."
        labelSahkan="Padam"
        onSahkan={sahkanPadam}
        onBatal={() => setDialogPadamTerbuka(false)}
        taipUlangTeks="PADAM"
      />
    </div>
  );
}
