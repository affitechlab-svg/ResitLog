// Taip data teras ResitLog. Sepadan dengan skema dalam 04-DATA-MODEL.md.
// Ganti/kembangkan bersama migrasi Supabase apabila fasa Supabase bermula — jangan biar bercanggah.

import type { KodKategori } from "@/lib/kategori";

export type Pakej = "basic" | "premium";
export type ModAkaun = "solo" | "pasangan";
export type Peranan = "utama" | "kedua";

export interface Pengguna {
  id: string;
  nama: string;
  emel: string;
  pakej: Pakej;
  mod: ModAkaun;
  isiRumahId: string | null;
  peranan: Peranan;
  tarikhMula: string; // ISO date
  dashboardHabisPada: string; // ISO date
  pasangDitunjuk: boolean;
  diciptaPada: string; // ISO timestamp
}

export interface IsiRumah {
  id: string;
  nama: string;
  pemilikId: string;
  diciptaPada: string;
}

export type CaraBayar = "tunai" | "kad" | "ewallet";
export type SumberResit = "gambar" | "album" | "manual";

export interface Resit {
  id: string;
  ref: string; // format RL-000142
  penggunaId: string;
  isiRumahId: string | null;
  kedai: string;
  noInvois: string | null;
  tarikh: string; // ISO date — tarikh belanja
  caraBayar: CaraBayar;
  jumlah: number;
  sumber: SumberResit;
  gambarLaluan: string | null;
  tiadaBukti: boolean;
  diciptaPada: string;
  dikemasPada: string;
}

export type Pemilik = "saya" | "pasangan" | "bersama";

export interface Item {
  id: string;
  resitId: string;
  nama: string;
  harga: number;
  kategori: KodKategori;
  pemilik: Pemilik;
  susunan: number;
}

// Resit berserta item — bentuk yang paling kerap digunakan dalam UI.
export interface ResitPenuh extends Resit {
  item: Item[];
}
