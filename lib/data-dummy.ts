// Seed data mentah sahaja. Skrin JANGAN import fail ini terus — guna lib/data.ts.
// Angka diambil terus dari 04-DATA-MODEL.md §8 supaya UI yang dibina boleh dibanding
// terus dengan rujukan reka bentuk (ResitLog_UI_dc.html).

import type { IsiRumah, Item, Pengguna, Resit } from "@/jenis";

export const PENGGUNA_UJIAN: Pengguna = {
  id: "pengguna-ujian",
  nama: "Ahmad Faizal",
  emel: "ujian@resitlog.my",
  pakej: "basic",
  mod: "solo",
  isiRumahId: null,
  peranan: "utama",
  tarikhMula: "2026-07-20",
  dashboardHabisPada: "2026-08-19",
  pasangDitunjuk: true,
  diciptaPada: "2026-07-20T09:00:00+08:00",
};

export const ISI_RUMAH_UJIAN: IsiRumah[] = [];

export const RESIT_UJIAN: Resit[] = [
  {
    id: "resit-142",
    ref: "RL-000142",
    penggunaId: PENGGUNA_UJIAN.id,
    isiRumahId: null,
    kedai: "Mydin Subang Jaya",
    noInvois: "INV-8823419",
    tarikh: "2026-08-11",
    caraBayar: "kad",
    jumlah: 113.70,
    sumber: "album",
    gambarLaluan: null,
    tiadaBukti: false,
    diciptaPada: "2026-08-11T14:20:00+08:00",
    dikemasPada: "2026-08-11T14:20:00+08:00",
  },
  {
    id: "resit-141",
    ref: "RL-000141",
    penggunaId: PENGGUNA_UJIAN.id,
    isiRumahId: null,
    kedai: "Klinik Amanah",
    noInvois: null,
    tarikh: "2026-08-10",
    caraBayar: "tunai",
    jumlah: 85.00,
    sumber: "gambar",
    gambarLaluan: null,
    tiadaBukti: false,
    diciptaPada: "2026-08-10T11:05:00+08:00",
    dikemasPada: "2026-08-10T11:05:00+08:00",
  },
  {
    id: "resit-140",
    ref: "RL-000140",
    penggunaId: PENGGUNA_UJIAN.id,
    isiRumahId: null,
    kedai: "Teh tarik + roti canai",
    noInvois: null,
    tarikh: "2026-08-10",
    caraBayar: "tunai",
    jumlah: 7.40,
    sumber: "manual",
    gambarLaluan: null,
    tiadaBukti: true,
    diciptaPada: "2026-08-10T08:15:00+08:00",
    dikemasPada: "2026-08-10T08:15:00+08:00",
  },
  {
    id: "resit-139",
    ref: "RL-000139",
    penggunaId: PENGGUNA_UJIAN.id,
    isiRumahId: null,
    kedai: "Shell Kesas",
    noInvois: null,
    tarikh: "2026-08-08",
    caraBayar: "kad",
    jumlah: 90.00,
    sumber: "gambar",
    gambarLaluan: null,
    tiadaBukti: false,
    diciptaPada: "2026-08-08T18:40:00+08:00",
    dikemasPada: "2026-08-08T18:40:00+08:00",
  },
  {
    id: "resit-138",
    ref: "RL-000138",
    penggunaId: PENGGUNA_UJIAN.id,
    isiRumahId: null,
    kedai: "Watsons IOI Mall",
    noInvois: null,
    tarikh: "2026-08-06",
    caraBayar: "kad",
    jumlah: 64.30,
    sumber: "gambar",
    gambarLaluan: null,
    tiadaBukti: false,
    diciptaPada: "2026-08-06T16:10:00+08:00",
    dikemasPada: "2026-08-06T16:10:00+08:00",
  },
  {
    id: "resit-120",
    ref: "RL-000120",
    penggunaId: PENGGUNA_UJIAN.id,
    isiRumahId: null,
    kedai: "Tenaga Nasional",
    noInvois: null,
    tarikh: "2026-07-28",
    caraBayar: "ewallet",
    jumlah: 132.60,
    sumber: "manual",
    gambarLaluan: null,
    tiadaBukti: true,
    diciptaPada: "2026-07-28T09:30:00+08:00",
    dikemasPada: "2026-07-28T09:30:00+08:00",
  },
];

export const ITEM_UJIAN: Item[] = [
  { id: "item-142-1", resitId: "resit-142", nama: "Beras Jasmine 5kg", harga: 42.90, kategori: "dapur", pemilik: "bersama", susunan: 0 },
  { id: "item-142-2", resitId: "resit-142", nama: "Pampers M 62s", harga: 58.00, kategori: "bayi", pemilik: "bersama", susunan: 1 },
  { id: "item-142-3", resitId: "resit-142", nama: "Panadol 20s", harga: 12.80, kategori: "perubatan", pemilik: "bersama", susunan: 2 },

  { id: "item-141-1", resitId: "resit-141", nama: "Konsultasi", harga: 45.00, kategori: "perubatan", pemilik: "bersama", susunan: 0 },
  { id: "item-141-2", resitId: "resit-141", nama: "Ubat batuk", harga: 40.00, kategori: "perubatan", pemilik: "bersama", susunan: 1 },

  { id: "item-140-1", resitId: "resit-140", nama: "Teh tarik + roti canai", harga: 7.40, kategori: "makanan", pemilik: "bersama", susunan: 0 },

  { id: "item-139-1", resitId: "resit-139", nama: "Petrol", harga: 90.00, kategori: "pengangkutan", pemilik: "bersama", susunan: 0 },

  { id: "item-138-1", resitId: "resit-138", nama: "Vitamin C", harga: 38.50, kategori: "perubatan", pemilik: "bersama", susunan: 0 },
  { id: "item-138-2", resitId: "resit-138", nama: "Ubat gigi", harga: 25.80, kategori: "perubatan", pemilik: "bersama", susunan: 1 },

  { id: "item-120-1", resitId: "resit-120", nama: "Bil elektrik Julai", harga: 132.60, kategori: "utiliti", pemilik: "bersama", susunan: 0 },
];
