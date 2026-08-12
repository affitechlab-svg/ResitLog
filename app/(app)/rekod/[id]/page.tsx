"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Dialog } from "@/komponen/ui";
import { useDataResit } from "@/lib/konteks-data";
import { formatRM, formatTarikh, labelCaraBayar } from "@/lib/format";
import { namaKategori } from "@/lib/kategori";

const LABEL_SUMBER: Record<string, string> = {
  gambar: "Kamera",
  album: "Album",
  manual: "Manual",
};

export default function HalamanButiranResit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { senaraiResit, padamResit } = useDataResit();
  const [dialogPadamTerbuka, setDialogPadamTerbuka] = useState(false);

  const resit = senaraiResit.find((r) => r.id === id);

  if (!resit) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <div className="text-base font-extrabold text-ink">Rekod tidak dijumpai</div>
        <p className="max-w-[280px] text-sm leading-relaxed text-muted">
          Rekod ini mungkin sudah dipadam, atau bukan milik akaun anda.
        </p>
        <button
          type="button"
          onClick={() => router.push("/rekod")}
          className="text-sm font-semibold text-maroon"
        >
          Kembali ke Rekod
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 border-b-2 border-ink px-4 py-2">
        <button type="button" onClick={() => router.push("/rekod")} aria-label="Kembali ke Rekod">
          <ChevronLeft size={22} strokeWidth={2} />
        </button>
        <span className="flex-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
          Butiran resit
        </span>
        <button
          type="button"
          onClick={() => setDialogPadamTerbuka(true)}
          aria-label="Padam resit"
          className="text-maroon"
        >
          <Trash2 size={20} strokeWidth={2} />
        </button>
      </div>

      <div className="px-5 pt-5">
        <div className="flex flex-wrap gap-2.5 text-[11px] font-semibold tracking-wider text-maroon">
          <span>#{resit.ref}</span>
          {resit.noInvois && (
            <>
              <span className="text-field-border">/</span>
              <span>INVOIS {resit.noInvois}</span>
            </>
          )}
        </div>
        <h1 className="mt-2.5 text-[30px] font-extrabold leading-tight tracking-tight">{resit.kedai}</h1>

        <div className="mt-[18px] grid grid-cols-2 border-t-2 border-ink">
          <div className="border-b border-hairline py-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Tarikh belanja</div>
            <div className="mt-1 text-[15px] font-semibold">{formatTarikh(resit.tarikh)}</div>
          </div>
          <div className="border-b border-l border-hairline py-2.5 pl-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Cara bayar</div>
            <div className="mt-1 text-[15px] font-semibold">{labelCaraBayar(resit.caraBayar)}</div>
          </div>
          <div className="py-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Sumber</div>
            <div className="mt-1 text-[15px] font-semibold">{LABEL_SUMBER[resit.sumber]}</div>
          </div>
          <div className="border-l border-hairline py-2.5 pl-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Direkod</div>
            <div className="mt-1 text-[15px] font-semibold">{formatTarikh(resit.diciptaPada)}</div>
          </div>
        </div>

        <div className="mt-1.5 border-t-2 border-ink pt-3 text-[11px] font-semibold uppercase tracking-wider">
          {resit.item.length} item
        </div>
        <div className="flex flex-col">
          {resit.item.map((i, indeks) => (
            <div
              key={i.id}
              className={`flex justify-between gap-3 py-2.5 ${
                indeks === resit.item.length - 1 ? "border-b-2 border-ink" : "border-b border-hairline"
              }`}
            >
              <div>
                <div className="text-[15px] font-semibold">{i.nama}</div>
                <div className="mt-1 text-xs text-maroon">{namaKategori(i.kategori)}</div>
              </div>
              <div className="text-[15px] font-extrabold">{i.harga.toFixed(2)}</div>
            </div>
          ))}
          <div className="flex items-baseline justify-between py-3">
            <span className="text-xs font-extrabold uppercase tracking-wider">Jumlah</span>
            <span className="text-2xl font-extrabold">{formatRM(resit.jumlah)}</span>
          </div>
        </div>

        <div className="border-t-2 border-ink pb-6 pt-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Gambar asal</span>
          </div>
          {resit.gambarLaluan ? (
            <div className="mt-2.5 h-[104px] border border-field-border bg-surface" />
          ) : (
            <p className="mt-2.5 text-sm leading-relaxed text-muted">
              {resit.tiadaBukti
                ? "Rekod ini dimasuk manual — tiada gambar resit."
                : "Gambar belum tersedia buat masa ini."}
            </p>
          )}
        </div>
      </div>

      <Dialog
        terbuka={dialogPadamTerbuka}
        tajuk="Padam resit ini?"
        mesej={`Resit "${resit.kedai}" dan semua itemnya akan dipadam terus. Tindakan ini tidak boleh dibatalkan.`}
        labelSahkan="Padam"
        onBatal={() => setDialogPadamTerbuka(false)}
        onSahkan={() => {
          padamResit(resit.id);
          router.push("/rekod");
        }}
      />
    </div>
  );
}
