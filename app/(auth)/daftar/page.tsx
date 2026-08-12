"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { Butang, Medan } from "@/komponen/ui";

export default function HalamanDaftar() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [emel, setEmel] = useState("");
  const [kataLaluan, setKataLaluan] = useState("");
  const [setujuTerma, setSetujuTerma] = useState(false);

  const bolehDaftar =
    nama.trim() !== "" && emel.trim() !== "" && kataLaluan.trim() !== "" && setujuTerma;

  function daftar() {
    if (!bolehDaftar) return;
    // Fasa 6: paparan sahaja — belum sambung Supabase Auth (rujuk Fasa 7).
    // Simulasi pendaftaran berjaya, teruskan ke aliran pemasangan kali pertama.
    router.push("/pasang");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-ground">
      <div className="flex items-center gap-3 border-b-2 border-ink px-4 py-2">
        <button type="button" onClick={() => router.push("/mula")} aria-label="Kembali">
          <ChevronLeft size={22} strokeWidth={2} />
        </button>
        <span className="flex-1 text-[17px] font-extrabold">Daftar akaun</span>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-5">
        <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-tight">
          Satu akaun,
          <br />
          rekod kekal
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          Tukar telefon, rekod masih ada. Tanpa akaun, tiada tempat nak simpan.
        </p>

        <div className="my-[18px] h-0.5 bg-ink" />

        <div className="flex flex-col gap-3">
          <Medan label="Nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama penuh" />
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
            placeholder="Sekurang-kurangnya 8 aksara"
          />
        </div>

        <button
          type="button"
          onClick={() => setSetujuTerma((s) => !s)}
          className="mt-4 flex items-start gap-2.5 text-left"
        >
          <span
            className={`mt-0.5 flex size-[18px] flex-none items-center justify-center border-2 ${
              setujuTerma ? "border-maroon bg-maroon" : "border-field-border bg-white"
            }`}
          >
            {setujuTerma && <Check size={13} strokeWidth={3} className="text-ground" />}
          </span>
          <span className="text-[13px] leading-relaxed text-[#4a4746]">
            Saya setuju dengan terma guna dan notis privasi ResitLog.
          </span>
        </button>

        <div className="mt-4">
          <Butang varian="utama" tinggi={54} onClick={daftar} disabled={!bolehDaftar}>
            Daftar
          </Butang>
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-field-border" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-disabled">atau</span>
          <div className="h-px flex-1 bg-field-border" />
        </div>

        <Butang varian="garis" tinggi={48} disabled className="text-sm font-semibold">
          Teruskan dengan Google
        </Butang>
        <div className="mt-2.5">
          <Butang varian="garis" tinggi={48} disabled className="text-sm font-semibold">
            Teruskan dengan Apple
          </Butang>
        </div>

        <div className="flex-1" />

        <div className="border-t border-hairline py-4 text-[13px] text-muted">
          Sudah ada akaun?{" "}
          <button type="button" onClick={() => router.push("/log-masuk")} className="font-bold text-maroon">
            Log masuk
          </button>
        </div>
      </div>
    </div>
  );
}
