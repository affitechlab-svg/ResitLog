// Katalog kategori tetap. Pengguna TIDAK boleh cipta, padam atau namakan semula.
// Sumber: 04-DATA-MODEL.md §6. Jangan tambah/ubah tanpa kemas kini dokumen itu dahulu.

export const KATEGORI = [
  { kod: "makanan", nama: "Makanan" },
  { kod: "minuman", nama: "Minuman" },
  { kod: "dapur", nama: "Barang dapur" },
  { kod: "bayi", nama: "Pampers & bayi" },
  { kod: "pakaian", nama: "Pakaian" },
  { kod: "perubatan", nama: "Perubatan" },
  { kod: "elektronik", nama: "Elektronik" },
  { kod: "pendidikan", nama: "Pendidikan" },
  { kod: "pengangkutan", nama: "Pengangkutan" },
  { kod: "utiliti", nama: "Utiliti" },
  { kod: "gayahidup", nama: "Gaya hidup" },
  { kod: "lain", nama: "Lain-lain" },
] as const;

export type KodKategori = (typeof KATEGORI)[number]["kod"];

export function namaKategori(kod: KodKategori): string {
  return KATEGORI.find((k) => k.kod === kod)?.nama ?? kod;
}
