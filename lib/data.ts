// Lapisan capaian data — SATU-SATUNYA fail yang dibaca oleh skrin untuk data.
// Fasa 0–6: baca daripada lib/data-dummy.ts (dalam memori, reset bila muat semula).
// Fasa 7: fungsi dalam fail ini ditukar untuk baca/tulis Supabase — skrin tidak berubah.

import { ITEM_UJIAN, PENGGUNA_UJIAN, RESIT_UJIAN } from "@/lib/data-dummy";
import { labelBulanTahun } from "@/lib/format";
import { namaKategori, type KodKategori } from "@/lib/kategori";
import type { Pengguna, ResitPenuh } from "@/jenis";

export function penggunaSemasa(): Pengguna {
  return PENGGUNA_UJIAN;
}

export function senaraiResitPenuh(): ResitPenuh[] {
  return RESIT_UJIAN.map((r) => ({
    ...r,
    item: ITEM_UJIAN.filter((i) => i.resitId === r.id),
  })).sort((a, b) => b.tarikh.localeCompare(a.tarikh));
}

export function resitPenuhMengikutId(id: string): ResitPenuh | undefined {
  return senaraiResitPenuh().find((r) => r.id === id);
}

// "Bulan ini" semasa fasa data dummy diambil daripada resit paling terkini dalam
// senarai (bukan jam sistem sebenar) — seed data sengaja berpusat sekitar Ogos 2026,
// supaya UI sentiasa ada data untuk dipapar tanpa kira bila dev server dijalankan.
// Fasa 7 (data sebenar) tukar ini kepada bulan kalendar sebenar.
export function bulanTerkiniData(senarai: ResitPenuh[]): string {
  const tarikhTertinggi = senarai.reduce(
    (terkini, r) => (r.tarikh > terkini ? r.tarikh : terkini),
    "0000-00-00",
  );
  return tarikhTertinggi.slice(0, 7);
}

export interface RingkasanBulan {
  resitBulan: ResitPenuh[];
  jumlah: number;
  bilanganResit: number;
  bilanganKategori: number;
}

export function ringkasanBulan(senarai: ResitPenuh[], kunciBulan: string): RingkasanBulan {
  const resitBulan = senarai.filter((r) => r.tarikh.startsWith(kunciBulan));
  const jumlah = resitBulan.reduce((jum, r) => jum + r.jumlah, 0);
  const kategoriUnik = new Set(resitBulan.flatMap((r) => r.item.map((i) => i.kategori)));
  return {
    resitBulan,
    jumlah,
    bilanganResit: resitBulan.length,
    bilanganKategori: kategoriUnik.size,
  };
}

export interface KumpulanBulan {
  kunciBulan: string;
  label: string;
  jumlah: number;
  resit: ResitPenuh[];
}

// Kumpulkan senarai (sudah ditapis carian, jika ada) ikut bulan — terbaru dahulu.
// Guna untuk skrin Rekod (03-SITEMAP-ROUTING.md #08).
export function kumpulanIkutBulan(senarai: ResitPenuh[]): KumpulanBulan[] {
  const kumpulan = new Map<string, ResitPenuh[]>();
  for (const r of senarai) {
    const kunci = r.tarikh.slice(0, 7);
    kumpulan.set(kunci, [...(kumpulan.get(kunci) ?? []), r]);
  }
  return [...kumpulan.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([kunciBulan, resit]) => ({
      kunciBulan,
      label: labelBulanTahun(`${kunciBulan}-01`),
      jumlah: resit.reduce((jum, r) => jum + r.jumlah, 0),
      resit,
    }));
}

export interface PecahanKategori {
  kategori: KodKategori;
  nama: string;
  jumlah: number;
  peratus: number; // 0-100, nisbah kepada jumlah keseluruhan bulan itu
}

// Pecahan belanja ikut kategori untuk satu bulan, disusun besar ke kecil.
// Guna untuk skrin Ringkasan (04-DATA-MODEL.md §9: dikira semasa dipapar, tidak disimpan).
export function pecahanKategoriBulan(senarai: ResitPenuh[], kunciBulan: string): PecahanKategori[] {
  const { resitBulan, jumlah: jumlahKeseluruhan } = ringkasanBulan(senarai, kunciBulan);
  const jumlahIkutKategori = new Map<KodKategori, number>();
  for (const r of resitBulan) {
    for (const i of r.item) {
      jumlahIkutKategori.set(i.kategori, (jumlahIkutKategori.get(i.kategori) ?? 0) + i.harga);
    }
  }
  return [...jumlahIkutKategori.entries()]
    .map(([kategori, jumlah]) => ({
      kategori,
      nama: namaKategori(kategori),
      jumlah,
      peratus: jumlahKeseluruhan > 0 ? (jumlah / jumlahKeseluruhan) * 100 : 0,
    }))
    .sort((a, b) => b.jumlah - a.jumlah);
}
