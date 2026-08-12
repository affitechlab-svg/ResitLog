"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Butang, Medan } from "@/komponen/ui";

export default function HalamanLogMasuk() {
  const router = useRouter();
  const [emel, setEmel] = useState("");
  const [kataLaluan, setKataLaluan] = useState("");

  const bolehLogMasuk = emel.trim() !== "" && kataLaluan.trim() !== "";

  function logMasuk() {
    if (!bolehLogMasuk) return;
    // Fasa 6: paparan sahaja — belum sambung Supabase Auth (rujuk Fasa 7).
    // Pengguna sedia ada, terus ke Utama (bukan aliran pemasangan kali pertama).
    router.push("/utama");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-ground">
      <div className="flex items-center gap-3 border-b-2 border-ink px-4 py-2">
        <button type="button" onClick={() => router.push("/mula")} aria-label="Kembali">
          <ChevronLeft size={22} strokeWidth={2} />
        </button>
        <span className="flex-1 text-[17px] font-extrabold">Log masuk</span>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-maroon">RESITLOG</div>
        <h2 className="mt-3.5 text-[30px] font-extrabold leading-[1.08] tracking-tight">
          Selamat kembali
        </h2>

        <div className="my-[22px] h-0.5 bg-ink" />

        <div className="flex flex-col gap-3.5">
          <Medan
            label="Emel"
            type="email"
            value={emel}
            onChange={(e) => setEmel(e.target.value)}
            placeholder="nama@emel.com"
          />
          <Medan
            label="Kata laluan"
            type="password"
            value={kataLaluan}
            onChange={(e) => setKataLaluan(e.target.value)}
            placeholder="Kata laluan anda"
          />
        </div>

        <button type="button" className="mt-3.5 text-left text-[13px] font-bold text-maroon">
          Lupa kata laluan?
        </button>

        <div className="mt-5">
          <Butang varian="utama" tinggi={56} onClick={logMasuk} disabled={!bolehLogMasuk}>
            Log masuk
          </Butang>
        </div>

        <div className="my-[22px] flex items-center gap-3">
          <div className="h-px flex-1 bg-field-border" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-disabled">atau</span>
          <div className="h-px flex-1 bg-field-border" />
        </div>

        <Butang varian="garis" tinggi={50} disabled className="text-sm font-semibold">
          Teruskan dengan Google
        </Butang>
        <div className="mt-2.5">
          <Butang varian="garis" tinggi={50} disabled className="text-sm font-semibold">
            Teruskan dengan Apple
          </Butang>
        </div>

        <div className="flex-1" />

        <div className="border-t border-hairline py-[18px] text-[13px] text-muted">
          Belum ada akaun?{" "}
          <button type="button" onClick={() => router.push("/daftar")} className="font-bold text-maroon">
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}
