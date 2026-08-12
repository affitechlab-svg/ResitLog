"use client";

// Storan sementara untuk alir Snap Resit -> Sedang Baca -> Semak (Fasa 5).
// mulaBacaan() memanggil /api/baca-resit (Claude API sebenar, Fasa 5C) dan
// mengemas kini status ikut keputusan panggilan sebenar — bar kemajuan pada
// skrin Sedang Baca dikira daripada masa berlalu semasa panggilan ini
// berjalan, bukan animasi tetap yang tidak kira apa-apa keadaan sebenar.

import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { CaraBayar } from "@/jenis";
import type { KodKategori } from "@/lib/kategori";

export interface ItemBacaan {
  id: string;
  nama: string;
  harga: number;
  kategori: KodKategori | null;
}

export interface KeputusanBacaan {
  kedai: string;
  noInvois: string | null;
  tarikh: string;
  caraBayar: CaraBayar;
  jumlahResit: number;
  item: ItemBacaan[];
  sumber: "gambar" | "album";
  gambarUrl: string | null;
  namaFail: string;
}

export type StatusBacaan = "kosong" | "membaca" | "sedia" | "ralat";

// Ikut BR-09 + 05-USER-FLOWS.md "Jalan gagal — bacaan gagal", ditambah dua
// kod pelengkap (tidak_jelas, ralat_pelayan) untuk keadaan yang model/pelayan
// sendiri boleh laporkan di luar 4 sebab asal.
export type KodRalatBacaan =
  | "gelap"
  | "bukan_resit"
  | "tidak_jelas"
  | "tiada_internet"
  | "timeout"
  | "ralat_pelayan";

const TEMPOH_TAMAT_MASA_MS = 20000;

interface KeputusanApi {
  kedai: string;
  noInvois: string | null;
  tarikh: string;
  caraBayar: CaraBayar;
  jumlahResit: number;
  item: { nama: string; harga: number }[];
}

interface NilaiKonteksBacaan {
  status: StatusBacaan;
  keputusan: KeputusanBacaan | null;
  kodRalat: KodRalatBacaan | null;
  gambarPratonton: string | null;
  sumberSemasa: "gambar" | "album" | null;
  mulaBacaan: (sumber: "gambar" | "album", blobGambar: Blob, namaFail: string) => void;
  kemaskiniKeputusan: (kemaskini: Partial<Omit<KeputusanBacaan, "item">>) => void;
  ubahKategoriItem: (idItem: string, kategori: KodKategori) => void;
  batal: () => void;
}

const KonteksBacaan = createContext<NilaiKonteksBacaan | null>(null);

export function PembekalBacaan({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<StatusBacaan>("kosong");
  const [keputusan, setKeputusan] = useState<KeputusanBacaan | null>(null);
  const [kodRalat, setKodRalat] = useState<KodRalatBacaan | null>(null);
  const [gambarPratonton, setGambarPratonton] = useState<string | null>(null);
  const [sumberSemasa, setSumberSemasa] = useState<"gambar" | "album" | null>(null);
  const gambarUrlRef = useRef<string | null>(null);

  const mulaBacaan = useCallback((sumber: "gambar" | "album", blobGambar: Blob, namaFail: string) => {
    const url = URL.createObjectURL(blobGambar);
    gambarUrlRef.current = url;

    setKeputusan(null);
    setKodRalat(null);
    setGambarPratonton(url);
    setSumberSemasa(sumber);
    setStatus("membaca");

    const kawalan = new AbortController();
    const pemasa = setTimeout(() => kawalan.abort(), TEMPOH_TAMAT_MASA_MS);

    const borang = new FormData();
    borang.append("gambar", blobGambar, namaFail);

    fetch("/api/baca-resit", { method: "POST", body: borang, signal: kawalan.signal })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!data || typeof data !== "object") {
          setKodRalat("ralat_pelayan");
          setStatus("ralat");
          return;
        }
        if (!data.ok) {
          setKodRalat((data.kod as KodRalatBacaan) ?? "ralat_pelayan");
          setStatus("ralat");
          return;
        }
        const k = data.keputusan as KeputusanApi;
        setKeputusan({
          kedai: k.kedai,
          noInvois: k.noInvois,
          tarikh: k.tarikh,
          caraBayar: k.caraBayar,
          jumlahResit: k.jumlahResit,
          sumber,
          gambarUrl: url,
          namaFail,
          item: k.item.map((i) => ({
            id: crypto.randomUUID(),
            nama: i.nama,
            harga: i.harga,
            kategori: null,
          })),
        });
        setStatus("sedia");
      })
      .catch((ralat: unknown) => {
        const namaRalat = ralat instanceof Error ? ralat.name : "";
        setKodRalat(namaRalat === "AbortError" ? "timeout" : "tiada_internet");
        setStatus("ralat");
      })
      .finally(() => {
        clearTimeout(pemasa);
      });
  }, []);

  const kemaskiniKeputusan = useCallback((kemaskini: Partial<Omit<KeputusanBacaan, "item">>) => {
    setKeputusan((semasa) => (semasa ? { ...semasa, ...kemaskini } : semasa));
  }, []);

  const ubahKategoriItem = useCallback((idItem: string, kategori: KodKategori) => {
    setKeputusan((semasa) =>
      semasa
        ? { ...semasa, item: semasa.item.map((i) => (i.id === idItem ? { ...i, kategori } : i)) }
        : semasa,
    );
  }, []);

  const batal = useCallback(() => {
    if (gambarUrlRef.current) {
      URL.revokeObjectURL(gambarUrlRef.current);
      gambarUrlRef.current = null;
    }
    setKeputusan(null);
    setKodRalat(null);
    setGambarPratonton(null);
    setSumberSemasa(null);
    setStatus("kosong");
  }, []);

  return (
    <KonteksBacaan.Provider
      value={{
        status,
        keputusan,
        kodRalat,
        gambarPratonton,
        sumberSemasa,
        mulaBacaan,
        kemaskiniKeputusan,
        ubahKategoriItem,
        batal,
      }}
    >
      {children}
    </KonteksBacaan.Provider>
  );
}

export function useBacaan(): NilaiKonteksBacaan {
  const konteks = useContext(KonteksBacaan);
  if (!konteks) {
    throw new Error("useBacaan() mesti dipanggil dalam <PembekalBacaan>");
  }
  return konteks;
}
