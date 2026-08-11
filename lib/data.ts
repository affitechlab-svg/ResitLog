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
