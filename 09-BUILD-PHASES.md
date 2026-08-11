# 09 — Build Phases · ResitLog v1

**Baca `CLAUDE.md` dahulu.** Dokumen ini menentukan **turutan** pembinaan. `CLAUDE.md` menentukan **peraturan**.

---

## Prinsip pembinaan

1. **Local dahulu, database kemudian.** Semua fasa 0–6 dibina di komputer sendiri menggunakan **data dummy dalam fail**. Supabase disambung pada Fasa 7, bukan sebelum itu.
2. **Satu fasa satu masa.** Jangan mula fasa baru sebelum checklist fasa semasa lulus.
3. **Setiap fasa mesti boleh dilihat.** Selepas setiap fasa, pemilik projek buka pelayar dan tengok hasilnya. Kalau tak nampak apa-apa, fasa itu belum siap.
4. **Log selepas setiap fasa.** Tulis dalam `WORK-LOG.md`, kemas kini status dalam `PROGRESS.md`.
5. **Pemilik projek bukan pembangun.** Terangkan dalam bahasa mudah. Beritahu dengan jelas bila ada perkara yang dia sendiri kena buat (buka akaun, dapatkan kunci API, tetapkan sesuatu).

---

## Data dummy — cara kerja Fasa 0–6

Cipta `lib/data-dummy.ts` yang mengandungi seed data dari `04-DATA-MODEL.md` (6 resit, pengguna ujian).

Semua skrin membaca dari fail ini. Simpan/edit/padam hanya mengubah state dalam memori — data kembali asal bila halaman dimuat semula. **Itu dijangka dan betul** untuk fasa ini.

Tulis fungsi capaian data dalam satu fail (`lib/data.ts`) supaya bila Supabase disambung pada Fasa 7, hanya fail itu yang perlu ditukar — bukan setiap skrin.

---

## FASA 0 — Asas projek

**Matlamat:** projek Next.js boleh dijalankan, reka bentuk sudah betul warnanya.

| # | Tugas |
|---|---|
| 0.1 | Next.js 15 + TypeScript (`strict: true`) + Tailwind |
| 0.2 | Token warna dalam `tailwind.config.ts` — radius dan bayang **dimatikan** pada peringkat konfigurasi |
| 0.3 | Font Archivo via `next/font/google` |
| 0.4 | `lucide-react` dipasang |
| 0.5 | Struktur folder ikut `02-TECH-STACK.md` |
| 0.6 | `lib/kategori.ts` — 12 kategori tetap |
| 0.7 | `lib/format.ts` — format RM, tarikh, nama bulan BM |
| 0.8 | `jenis/index.ts` — taip Resit, Item, Pengguna ikut `04-DATA-MODEL.md` |
| 0.9 | `lib/data-dummy.ts` — seed data 6 resit |
| 0.10 | `WORK-LOG.md` dan `PROGRESS.md` wujud dan berfungsi |

**Siap bila:** `npm run dev` jalan tanpa ralat, halaman ujian memaparkan teks Archivo dengan warna maroon `#6e1428` yang betul.

---

## FASA 1 — Komponen UI asas

**Matlamat:** blok binaan untuk semua skrin.

| # | Komponen |
|---|---|
| 1.1 | `Butang` — utama (maroon), garis, nyahaktif; semua keadaan hover/tekan/fokus |
| 1.2 | `Medan` — input teks, sempadan 2px, label kiri |
| 1.3 | `Chip` — isi maroon, garis, **garis putus** (untuk "Pilih kategori") |
| 1.4 | `SegmentedControl` — untuk cara bayar dan Bulanan/Tahunan |
| 1.5 | `TabBar` — 4 destinasi, keadaan aktif/tidak aktif |
| 1.6 | `Dialog` — pengesahan, dengan pilihan taip semula teks |
| 1.7 | `BlokPoster` — blok maroon penuh lebar untuk jumlah |
| 1.8 | `KeadaanKosong` — mesej + cadangan tindakan |

**Siap bila:** satu halaman ujian memaparkan semua komponen. Bandingkan sebelah-menyebelah dengan `ResitLog_UI_dc.html` — warna, saiz, jarak mesti sama.

**Kenapa dahulu:** setiap skrin selepas ini menggunakan komponen yang sama. Bina sekali, guna 14 kali.

---

## FASA 2 — Masuk manual + simpan

**Matlamat:** ciri pertama yang benar-benar boleh diguna.

| # | Tugas |
|---|---|
| 2.1 | Skrin 04 Utama — versi ringkas: blok poster + tiga butang |
| 2.2 | Skrin 07 Masuk Manual — penuh ikut reka bentuk |
| 2.3 | Medan jumlah besar (RM + 52px/800, garis bawah maroon) |
| 2.4 | Grid 12 chip kategori, satu boleh dipilih |
| 2.5 | Simpan ke state — rekod muncul dalam "Terkini" pada Utama |
| 2.6 | Butang Simpan nyahaktif bila jumlah kosong atau kategori belum dipilih |
| 2.7 | Rekod ditanda `tiada_bukti = true` |

**Siap bila:** semua kotak Bahagian E dalam `06-ACCEPTANCE-CRITERIA.md` lulus.

**Kenapa dahulu, bukan snap resit:** ini paling senang dibina, dan ia menguji sama ada struktur data betul. Kalau skema salah, jumpa dengan 5 rekod, bukan 50. Snap resit ialah ciri paling menarik tetapi paling banyak kerja — asas kena kukuh dulu.

---

## FASA 3 — Rekod dan butiran

**Matlamat:** data yang disimpan jadi bermakna.

| # | Tugas |
|---|---|
| 3.1 | Skrin 08 Rekod — dikumpul ikut bulan, tajuk seksyen latar `#eae9e9` |
| 3.2 | Jumlah setiap bulan pada tajuk seksyen |
| 3.3 | Baris rekod — kedai, chip kategori "+n", jumlah, tarikh |
| 3.4 | Chip garis "Tiada bukti" untuk rekod manual |
| 3.5 | Carian nama kedai (tidak sensitif huruf besar/kecil) |
| 3.6 | Skrin 09 Butiran Resit — rujukan, grid meta 2×2, senarai item, jumlah |
| 3.7 | Padam resit dengan dialog pengesahan |
| 3.8 | Keadaan kosong untuk senarai kosong dan carian tanpa hasil |

**Siap bila:** Bahagian F dalam `06-ACCEPTANCE-CRITERIA.md` lulus (kecuali yang berkaitan gambar — itu Fasa 5).

---

## FASA 4 — Ringkasan bulanan

**Matlamat:** ganjaran untuk pengguna yang rajin rekod.

| # | Tugas |
|---|---|
| 4.1 | Skrin 10 Ringkasan — blok poster, jumlah bulan ini |
| 4.2 | Senarai kategori dengan bar mendatar 8px, susun besar ke kecil |
| 4.3 | Perbandingan dengan bulan lepas |
| 4.4 | Segmented control Bulanan/Tahunan — Tahunan berikon kunci |
| 4.5 | **Penafian cukai** (BR-05) — wajib |
| 4.6 | Keadaan kosong bila tiada rekod bulan itu |

**Siap bila:** Bahagian G dalam `06-ACCEPTANCE-CRITERIA.md` lulus, kecuali paparan Tahunan sebenar (Premium, Fasa 8).

**Berhenti di sini dan tunjukkan pada pemilik projek.** Empat fasa ini sudah cukup untuk menilai sama ada aliran terasa betul, sebelum melabur masa pada bacaan resit.

---

## FASA 5 — Snap resit dan skrin Semak

**Matlamat:** ciri utama produk.

**Fasa paling berat. Pecahkan kepada tiga bahagian.**

### 5A — Skrin Semak dengan data palsu

| # | Tugas |
|---|---|
| 5A.1 | Skrin 06 Semak Resit — semua medan boleh diedit |
| 5A.2 | Senarai item dengan chip kategori; chip **garis putus** untuk belum dipilih |
| 5A.3 | Butang Simpan **nyahaktif** selagi ada item tanpa kategori (BR-02) |
| 5A.4 | Footer melekat dengan jumlah item, dikira semula secara langsung |
| 5A.5 | Tunjuk beza bila jumlah item ≠ jumlah pada resit (BR-03) |
| 5A.6 | Dialog amaran bila tekan kembali sebelum simpan |

Gunakan data Mydin dari seed: 42.90 + 58.00 + 12.80 = RM 113.70.

### 5B — Ambil dan mampat gambar

| # | Tugas |
|---|---|
| 5B.1 | Butang Snap Resit buka kamera peranti |
| 5B.2 | Butang Muat Naik dari Album buka pemilih fail |
| 5B.3 | Mampat gambar ke lebar 1400px, kualiti 0.82, saiz ≤300KB |
| 5B.4 | Skrin 05 Sedang Baca — skrin ink penuh, bar kemajuan |

### 5C — Bacaan sebenar

| # | Tugas |
|---|---|
| 5C.1 | Route handler `/api/baca-resit` — kunci API di server sahaja |
| 5C.2 | Sahkan bentuk balasan sebelum hantar ke klien |
| 5C.3 | Bar kemajuan **bergerak sebenar** mengikut keadaan panggilan |
| 5C.4 | Empat mesej ralat BM + dua jalan keluar setiap satu (BR-09) |
| 5C.5 | Sasaran: snap → skrin Semak dalam ≤10 saat |

**Pemilik projek kena buat:** dapatkan kunci API Anthropic dan letak dalam fail `.env.local`. Claude Code akan beritahu bila masanya.

**Siap bila:** Bahagian C dan D dalam `06-ACCEPTANCE-CRITERIA.md` lulus. Uji dengan **sekurang-kurangnya 10 resit sebenar**, bukan gambar contoh.

---

## FASA 6 — Skrin selebihnya

| # | Skrin |
|---|---|
| 6.1 | Skrin 01 Mula / Daftar — paparan sahaja, belum ada auth sebenar |
| 6.2 | Skrin 02 Daftar — borang, checkbox terma mengawal butang |
| 6.3 | Skrin 03 Log Masuk — borang |
| 6.4 | Skrin 11 Tetapan — semua seksyen, item Premium berikon kunci |
| 6.5 | Padam semua data dengan taip semula `PADAM` (BR-08) |
| 6.6 | Skrin 12 Tambah ke Skrin Utama — arahan iPhone dan Android |
| 6.7 | Manifest PWA + service worker |

**Siap bila:** Bahagian I dan J dalam `06-ACCEPTANCE-CRITERIA.md` lulus. Auth belum berfungsi — borang hanya paparan sehingga Fasa 7.

---

## FASA 7 — Supabase *(data sebenar)*

**Matlamat:** data kekal, bukan hilang bila halaman dimuat semula.

**Fasa pertama yang memerlukan tindakan pemilik projek.**

| # | Tugas |
|---|---|
| 7.1 | Cipta projek Supabase *(pemilik projek)* |
| 7.2 | Migrasi SQL ikut `04-DATA-MODEL.md` — simpan dalam `supabase/migrations/` |
| 7.3 | **Row Level Security pada setiap jadual** — sebelum sebarang data dimasukkan |
| 7.4 | Bucket Storage `resit-gambar` — peribadi, signed URL 1 jam |
| 7.5 | Auth: emel + kata laluan |
| 7.6 | Auth: Google OAuth |
| 7.7 | Auth: Apple OAuth |
| 7.8 | Middleware — semakan sesi dan pengalihan ikut `03-SITEMAP-ROUTING.md` |
| 7.9 | **Tukar `lib/data.ts` dari dummy ke Supabase** — skrin tidak perlu diubah |
| 7.10 | Muat naik gambar ke Storage selepas Simpan sahaja |

**Pemilik projek kena buat:**
- Buka akaun Supabase *(percuma)*
- Salin URL projek dan dua kunci ke `.env.local`
- Untuk Google/Apple OAuth: daftar aplikasi di Google Cloud Console dan Apple Developer

**Siap bila:** Bahagian B dan K dalam `06-ACCEPTANCE-CRITERIA.md` lulus. **Uji dengan dua akaun berbeza** — pengguna A tidak boleh nampak rekod pengguna B.

---

## FASA 8 — Premium

| # | Tugas |
|---|---|
| 8.1 | Medan `pakej` mengawal apa yang dipapar |
| 8.2 | Ringkasan Tahunan berfungsi untuk Premium |
| 8.3 | Paywall bila Basic tekan Tahunan |
| 8.4 | Eksport ke Excel dengan tajuk lajur BM |
| 8.5 | Mod pasangan — cipta isi rumah, jemput pasangan, tunjuk medan Pemilik |
| 8.6 | Bayaran *(Stripe atau alternatif tempatan)* |

**Belum diputuskan:** harga RM9/bulan masih sementara. Sahkan sebelum bina bahagian bayaran.

---

## FASA 9 — Dashboard AI Insight

**Fasa terakhir. Boleh ditangguh ke selepas pelancaran.**

| # | Tugas |
|---|---|
| 9.1 | Skrin 13 — carta 6 bulan, tiga kad insight, perubahan kategori |
| 9.2 | Bar percubaan dengan baki hari sebenar (BR-07) |
| 9.3 | Skrin 14 — paparan terkunci, kandungan kabur |
| 9.4 | Nota "snap dan simpan kekal bebas pada Basic" — **wajib** |
| 9.5 | Keadaan kosong untuk pengguna dengan kurang 2 bulan data |

**Nota jujur:** ciri ini bukan sebahagian daripada 7 ciri MVP asal dalam `01-PRD.md`. Ia masuk kerana sudah ada dalam reka bentuk. Jika masa suntuk, **lancarkan tanpa fasa ini** — ResitLog tetap berguna.

---

## FASA 10 — Hosting dan pelancaran

Platform: **Railway** (plan Hobby, USD 5/bulan).

| # | Tugas |
|---|---|
| 10.1 | Putuskan sambungan repo dari Vercel *(Settings → Git → Disconnect)* |
| 10.2 | Sambung repo GitHub ke Railway — New Project → Deploy from GitHub repo |
| 10.3 | Tetapkan semua pemboleh ubah persekitaran dalam tab **Variables** |
| 10.4 | Sambung `resitlog.my` — Settings → Domains → Custom Domain |
| 10.5 | Tambah rekod DNS yang Railway beri, pada panel pendaftar domain |
| 10.6 | Sahkan SSL aktif *(automatik melalui Let's Encrypt, 5–30 minit)* |
| 10.7 | Projek Supabase berasingan untuk produksi |
| 10.8 | Uji pada iPhone Safari sebenar |
| 10.9 | Uji pada Android Chrome sebenar |
| 10.10 | Bahagian O `06-ACCEPTANCE-CRITERIA.md` — semakan akhir |

**Pemilik projek kena buat:**
- Daftar akaun Railway *(guna Login with GitHub — akaun sama dengan repo ResitLog)*
- Pilih plan **Hobby**, masukkan kad kredit untuk aktifkan
- Beli domain `resitlog.my` dari pendaftar MYNIC berlesen *(Exabytes, Xantec, Shinjiru)*

**Kenapa bukan Vercel:** plan Hobby Vercel melarang penggunaan komersial, dan ResitLog ada pakej Premium berbayar. Vercel Pro berharga USD 20/orang/bulan berbanding Railway USD 5/bulan.

**Sebelum lepas kepada orang lain:** pemilik projek guna sendiri **14 hari penuh** dengan resit sebenar (`01-PRD.md` Bahagian 10). Ini bukan formaliti.

---

## Ringkasan turutan

```
0  Asas projek           ─┐
1  Komponen UI            │  Local, data dummy
2  Masuk manual           │  Tiada database
3  Rekod & butiran        │
4  Ringkasan bulanan     ─┘  ← tunjuk pada pemilik projek
5  Snap resit             ─── perlu kunci API
6  Skrin selebihnya
7  Supabase               ─── perlu akaun Supabase
8  Premium                ─── perlu keputusan harga
9  Dashboard AI           ─── boleh ditangguh
10 Hosting & lancar       ─── perlu keputusan platform
```

---

## Peraturan log

Selepas setiap fasa:

1. Tulis entri dalam `WORK-LOG.md` ikut format dalam `CLAUDE.md` Bahagian 3
2. Kemas kini status fasa dalam `PROGRESS.md`: `belum` → `sedang` → `siap`
3. Jika ada keputusan yang bercanggah dengan dokumen handoff, **catat dan beritahu pemilik projek** — jangan senyap ubah dokumen
4. Jika tersekat, catat dalam log dan berhenti. Jangan reka penyelesaian sendiri yang keluar dari skop

---

## Bila tidak pasti

Berhenti dan tanya. Pemilik projek bukan pembangun — lebih baik satu soalan mudah daripada satu minggu kerja ke arah yang salah.

Soalan yang wajar ditanya: apa-apa yang tiada dalam dokumen handoff, atau apa-apa yang dokumen bercanggah antara satu sama lain.

Soalan yang tidak perlu ditanya: perkara yang sudah dijawab dalam `CLAUDE.md`, `01-PRD.md`, atau `04-DATA-MODEL.md`. Baca dahulu.
