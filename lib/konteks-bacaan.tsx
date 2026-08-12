"use client";

// Storan sementara untuk alir Snap Resit -> Sedang Baca -> Semak (Fasa 5A/5B).
// Bacaan SEBENAR (panggilan Claude API melalui /api/baca-resit) itu Fasa 5C —
// belum disambung. Buat masa ini, mulaBacaan() jana keputusan palsu daripada
// data seed Mydin (04-DATA-MODEL.md §8) supaya alir penuh boleh diuji hujung ke hujung.

import { createContext, useCallback, useContext, useState } from "react";
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

export type StatusBacaan = "kosong" | "membaca" | "sedia";

function tarikhHariIni(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Panadol sengaja tiada kategori supaya alir "Pilih kategori" (BR-02) boleh diuji,
// sama seperti skrin 06 dalam ResitLog_UI_dc.html.
function janaKeputusanPalsu(
  sumber: "gambar" | "album",
  gambarUrl: string | null,
  namaFail: string,
): KeputusanBacaan {
  return {
    kedai: "Mydin Subang Jaya",
    noInvois: "INV-8823419",
    tarikh: tarikhHariIni(),
    caraBayar: "kad",
    jumlahResit: 113.7,
    sumber,
    gambarUrl,
    namaFail,
    item: [
      { id: crypto.randomUUID(), nama: "Beras Jasmine 5kg", harga: 42.9, kategori: "dapur" },
      { id: crypto.randomUUID(), nama: "Pampers M 62s", harga: 58.0, kategori: "bayi" },
      { id: crypto.randomUUID(), nama: "Panadol 20s", harga: 12.8, kategori: null },
    ],
  };
}

interface NilaiKonteksBacaan {
  status: StatusBacaan;
  keputusan: KeputusanBacaan | null;
  mulaBacaan: (sumber: "gambar" | "album", gambarUrl: string | null, namaFail: string) => void;
  tandaSedia: () => void;
  kemaskiniKeputusan: (kemaskini: Partial<Omit<KeputusanBacaan, "item">>) => void;
  ubahKategoriItem: (idItem: string, kategori: KodKategori) => void;
  batal: () => void;
}

const KonteksBacaan = createContext<NilaiKonteksBacaan | null>(null);

export function PembekalBacaan({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<StatusBacaan>("kosong");
  const [keputusan, setKeputusan] = useState<KeputusanBacaan | null>(null);

  const mulaBacaan = useCallback(
    (sumber: "gambar" | "album", gambarUrl: string | null, namaFail: string) => {
      setKeputusan(janaKeputusanPalsu(sumber, gambarUrl, namaFail));
      setStatus("membaca");
    },
    [],
  );

  const tandaSedia = useCallback(() => setStatus("sedia"), []);

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
    setKeputusan((semasa) => {
      if (semasa?.gambarUrl) URL.revokeObjectURL(semasa.gambarUrl);
      return null;
    });
    setStatus("kosong");
  }, []);

  return (
    <KonteksBacaan.Provider
      value={{ status, keputusan, mulaBacaan, tandaSedia, kemaskiniKeputusan, ubahKategoriItem, batal }}
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
