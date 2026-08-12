"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Butang } from "@/komponen/ui";

interface EventPromptPasang extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function HalamanPasang() {
  const router = useRouter();
  const [promptPasang, setPromptPasang] = useState<EventPromptPasang | null>(null);

  useEffect(() => {
    function tangkap(e: Event) {
      e.preventDefault();
      setPromptPasang(e as EventPromptPasang);
    }
    window.addEventListener("beforeinstallprompt", tangkap);
    return () => window.removeEventListener("beforeinstallprompt", tangkap);
  }, []);

  async function tambahSekarang() {
    if (!promptPasang) return;
    await promptPasang.prompt();
    setPromptPasang(null);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-ground">
      <div className="flex items-center gap-3 border-b-2 border-ink px-4 py-2">
        <button type="button" onClick={() => router.back()} aria-label="Kembali">
          <ChevronLeft size={22} strokeWidth={2} />
        </button>
        <span className="flex-1 text-[17px] font-extrabold">Tambah ke Skrin Utama</span>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-maroon">
          Web app · tiada muat turun
        </div>
        <h2 className="mt-3.5 text-[30px] font-extrabold leading-[1.08] tracking-tight">
          Letak ResitLog
          <br />
          di skrin utama
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#4a4746]">
          Buka resitlog.my dalam pelayar, tambah sebagai shortcut. Ia terbuka penuh skrin seperti
          app biasa — tanpa App Store atau Play Store.
        </p>

        <div className="mt-5 h-0.5 bg-ink" />

        <div className="flex items-center gap-3.5 border-b border-hairline py-4">
          <div className="flex size-16 flex-none items-center justify-center bg-maroon text-[22px] font-extrabold text-ground">
            RL
          </div>
          <div>
            <div className="text-base font-extrabold">ResitLog</div>
            <div className="mt-1 text-xs text-muted">Ikon shortcut pada skrin utama</div>
          </div>
        </div>

        <div className="mb-2 mt-[18px] text-[11px] font-semibold uppercase tracking-wider">
          iPhone · Safari
        </div>
        <div className="flex flex-col">
          {["Tekan ikon Kongsi di bawah pelayar", "Pilih Tambah ke Skrin Utama", "Tekan Tambah — siap"].map(
            (langkah, i) => (
              <div key={langkah} className="flex gap-3 border-b border-hairline py-2.5 last:border-b-0">
                <span className="w-4 text-[13px] font-extrabold text-maroon">{i + 1}</span>
                <span className="text-sm">{langkah}</span>
              </div>
            ),
          )}
        </div>

        <div className="mb-2 mt-3.5 border-t-2 border-ink pt-3.5 text-[11px] font-semibold uppercase tracking-wider">
          Android · Chrome
        </div>
        <div className="flex flex-col">
          {["Tekan menu tiga titik di atas", "Pilih Pasang aplikasi"].map((langkah, i) => (
            <div key={langkah} className="flex gap-3 border-b border-hairline py-2.5 last:border-b-0">
              <span className="w-4 text-[13px] font-extrabold text-maroon">{i + 1}</span>
              <span className="text-sm">{langkah}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2.5 border-t-2 border-ink px-5 py-3.5">
        <Butang varian="utama" tinggi={54} onClick={tambahSekarang}>
          Tambah sekarang
        </Butang>
        <Butang varian="garis" tinggi={54} lebarPenuh={false} className="w-24" onClick={() => router.back()}>
          Nanti
        </Butang>
      </div>
    </div>
  );
}
