// Lapisan capaian data — SATU-SATUNYA fail yang dibaca oleh skrin untuk data.
// Fasa 0–6: baca daripada lib/data-dummy.ts (dalam memori, reset bila muat semula).
// Fasa 7: fungsi dalam fail ini ditukar untuk baca/tulis Supabase — skrin tidak berubah.

import { ITEM_UJIAN, PENGGUNA_UJIAN, RESIT_UJIAN } from "@/lib/data-dummy";
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
