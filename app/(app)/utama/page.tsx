"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Upload, PenLine } from "lucide-react";
import { Butang, BlokPoster, KeadaanKosong } from "@/komponen/ui";
import BarisResit from "@/komponen/resit/BarisResit";
import { useDataResit } from "@/lib/konteks-data";
import { useBacaan } from "@/lib/konteks-bacaan";
import { bulanTerkiniData, ringkasanBulan } from "@/lib/data";
import { formatRM, labelBulanTahun } from "@/lib/format";
import { mampatGambar } from "@/lib/gambar";

const BILANGAN_TERKINI = 5;

export default function HalamanUtama() {
  const router = useRouter();
  const { pengguna, senaraiResit } = useDataResit();
  const { mulaBacaan } = useBacaan();
  const inputKameraRef = useRef<HTMLInputElement>(null);
  const inputAlbumRef = useRef<HTMLInputElement>(null);

  const kunciBulan = bulanTerkiniData(senaraiResit);
  const { jumlah, bilanganResit, bilanganKategori } = ringkasanBulan(senaraiResit, kunciBulan);
  const terkini = senaraiResit.slice(0, BILANGAN_TERKINI);

  async function failDipilih(sumber: "gambar" | "album", e: ChangeEvent<HTMLInputElement>) {
    const fail = e.target.files?.[0];
    e.target.value = "";
    if (!fail) return;
    const blobMampat = await mampatGambar(fail);
    const url = URL.createObjectURL(blobMampat);
    mulaBacaan(sumber, url, fail.name);
    router.push("/semak");
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3">
        <span className="text-[15px] font-extrabold tracking-wide">RESITLOG</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-maroon">
          {pengguna.pakej === "premium" ? "Premium" : "Basic"}
        </span>
      </div>

      <BlokPoster
        besar
        label="Belanja bulan ini"
        nilai={formatRM(jumlah)}
        meta={`${labelBulanTahun(`${kunciBulan}-01`)} · ${bilanganResit} resit · ${bilanganKategori} kategori`}
      />

      <div className="flex flex-col gap-3 p-5">
        <Butang
          varian="ink"
          tinggi={84}
          ikon={<Camera size={28} strokeWidth={2} />}
          onClick={() => inputKameraRef.current?.click()}
        >
          <span className="block">Snap Resit</span>
          <span className="mt-1 block text-xs font-normal opacity-75">Kamera terbuka terus</span>
        </Butang>
        <input
          ref={inputKameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => failDipilih("gambar", e)}
        />

        <Butang
          varian="garis"
          tinggi={64}
          ikon={<Upload size={24} strokeWidth={2} />}
          onClick={() => inputAlbumRef.current?.click()}
        >
          <span className="block">Muat Naik dari Album</span>
          <span className="mt-1 block text-xs font-normal text-muted">Gambar resit yang sudah ada</span>
        </Butang>
        <input
          ref={inputAlbumRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => failDipilih("album", e)}
        />

        <Butang
          varian="garis"
          tinggi={64}
          ikon={<PenLine size={24} strokeWidth={2} />}
          onClick={() => router.push("/manual")}
        >
          <span className="block">Masuk Manual</span>
          <span className="mt-1 block text-xs font-normal text-muted">Belanja tunai, tiada resit</span>
        </Butang>
      </div>

      <div className="px-5 pb-6">
        <div className="flex items-baseline justify-between border-t-2 border-ink pt-3.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Terkini</span>
          <Link href="/rekod" className="text-xs font-semibold text-maroon">
            Semua rekod
          </Link>
        </div>
        {terkini.length === 0 ? (
          <KeadaanKosong
            tajuk="Belum ada rekod"
            mesej="Snap resit pertama anda atau masuk manual untuk mula rekod belanja."
          />
        ) : (
          <div className="flex flex-col">
            {terkini.map((r) => (
              <BarisResit key={r.id} resit={r} tunjukKategori={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
