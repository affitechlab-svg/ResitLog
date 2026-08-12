"use client";

import { useRouter } from "next/navigation";
import { Butang } from "@/komponen/ui";

export default function HalamanMula() {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-ground">
      <div className="flex flex-1 flex-col px-6 pb-6 pt-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-maroon">
          Selamat datang
        </div>
        <h1 className="mt-3.5 text-[44px] font-extrabold leading-[0.98] tracking-tight">
          RESITLOG
        </h1>
        <p className="mt-4 max-w-[280px] text-base leading-relaxed text-[#4a4746]">
          Snap resit. Rekod tersimpan kemas ikut kategori. Tiada lagi kotak dan laci.
        </p>

        <div className="my-7 h-0.5 bg-ink" />

        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider">Cara guna</div>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3.5 border-2 border-maroon bg-maroon-tint p-4">
            <div className="mt-0.5 flex size-[18px] flex-none items-center justify-center border-2 border-maroon bg-maroon">
              <div className="size-[8px] bg-maroon-tint" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold">Sendiri</div>
              <div className="mt-1 text-[13px] text-on-tint">Satu akaun. Semua rekod milik anda.</div>
            </div>
          </div>
          <div className="flex items-start gap-3.5 border-2 border-field-border bg-white p-4">
            <div className="mt-0.5 size-[18px] flex-none border-2 border-field-border" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-extrabold text-disabled">Pasangan</span>
                <span className="bg-maroon px-[7px] py-[3px] text-[10px] font-extrabold uppercase tracking-wider text-ground">
                  Premium
                </span>
              </div>
              <div className="mt-1 text-[13px] text-disabled">Dua akaun, satu sistem. Belum dibuka.</div>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <Butang varian="utama" tinggi={60} onClick={() => router.push("/daftar")}>
          Daftar akaun
        </Butang>
        <div className="mt-2.5">
          <Butang varian="garis" tinggi={56} onClick={() => router.push("/log-masuk")}>
            Log masuk
          </Butang>
        </div>
        <div className="mt-3.5 text-xs text-muted">
          Akaun diperlukan supaya rekod anda kekal bila tukar telefon. Pakej Basic, tiada bayaran.
        </div>
      </div>
    </div>
  );
}
