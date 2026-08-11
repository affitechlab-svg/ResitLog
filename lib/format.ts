// Pemformatan RM, tarikh dan nama bulan dalam Bahasa Melayu.

const NAMA_BULAN = [
  "Januari", "Februari", "Mac", "April", "Mei", "Jun",
  "Julai", "Ogos", "September", "Oktober", "November", "Disember",
];

export function formatRM(nilai: number): string {
  const bertanda = nilai < 0 ? "-" : "";
  const mutlak = Math.abs(nilai).toFixed(2);
  const [ringgit, sen] = mutlak.split(".");
  const ringgitBerkoma = ringgit.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${bertanda}RM ${ringgitBerkoma}.${sen}`;
}

export function formatTarikh(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export function namaBulan(bulanIndex: number): string {
  return NAMA_BULAN[bulanIndex] ?? "";
}

export function kunciBulan(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function labelBulanTahun(iso: string): string {
  const d = new Date(iso);
  return `${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;
}
