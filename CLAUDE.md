# CLAUDE.md — Peraturan Build ResitLog

**BACA FAIL INI DAHULU sebelum tulis sebarang kod.**
Fail ini mengatasi tabiat lalai. Jika ada percanggahan antara fail ini dan dokumen lain, fail ini menang — kecuali `04-DATA-MODEL.md` untuk hal skema.

---

## 0. Konteks projek

ResitLog — aplikasi web mobile-first (PWA) Bahasa Melayu untuk merekod resit belanja harian. Pengguna snap resit, sistem baca, pengguna semak dan simpan.

Dokumen rujukan dalam folder ini:

| Fail | Isi |
|---|---|
| `CLAUDE.md` | Fail ini — peraturan build |
| `01-PRD.md` | Skop, ciri, business rules, katalog kategori |
| `02-TECH-STACK.md` | Next.js + Tailwind + Supabase + Vercel |
| `03-SITEMAP-ROUTING.md` | Senarai page dan laluan URL |
| `04-DATA-MODEL.md` | Jadual, medan, hubungan, seed data |
| `05-USER-FLOWS.md` | Langkah pengguna |
| `06-ACCEPTANCE-CRITERIA.md` | Checklist QA |
| `09-BUILD-PHASES.md` | Turutan pembinaan *(akan menyusul)* |

Rujukan reka bentuk: `ResitLog_UI_dc.html` — 14 skrin, high-fidelity.

---

## 1. Peraturan MESTI (non-negotiable)

### 1.1 Bahasa
- **Semua teks yang dilihat pengguna mesti Bahasa Melayu.** Tiada campuran Inggeris dalam UI.
- Nama pembolehubah, fungsi, jadual dan medan dalam kod: **Bahasa Melayu** juga (`resit`, `kedai`, `cara_bayar`, `tiada_bukti`). Ini disengajakan supaya kod dan dokumen sepadan.
- Komen kod: Bahasa Melayu.
- Mesej ralat kepada pengguna: Bahasa Melayu, dan **mesti beritahu langkah seterusnya**. Contoh betul: *"Gambar terlalu gelap. Cuba snap semula, atau masuk manual."* Contoh salah: *"OCR failed."*

### 1.2 Reka bentuk — jangan ubah
Reka bentuk sudah muktamad. **Jangan cadang tema lain, jangan tukar warna, jangan tambah bayang atau sudut bulat.**

| Token | Nilai | Guna |
|---|---|---|
| `ink` | `#201e1d` | teks utama, garis 2px, sempadan |
| `ground` | `#f6f5f4` | latar skrin |
| `surface` | `#eae9e9` | tajuk seksyen, bar kosong |
| `maroon` | `#6e1428` | butang utama, blok poster, aksen |
| `maroon-pressed` | `#4a0d1b` | keadaan tekan |
| `maroon-tint` | `#f0e4e7` | chip kategori, kad Premium |
| `on-tint` | `#5c3a41` | teks dalam blok maroon tint |
| `muted` | `#6d6a68` | teks sekunder, meta |
| `disabled` | `#8a8785` | item terkunci, tab tidak aktif |
| `hairline` | `#d5d3d2` | pemisah baris 1px |
| `field-border` | `#cbc9c8` | sempadan medan tidak aktif |
| `white` | `#ffffff` | latar input |

**Peraturan keras:**
- `border-radius: 0` **di mana-mana**. Tiada pengecualian.
- **Tiada** `box-shadow`. **Tiada** gradient.
- Font tunggal: **Archivo** (400 / 500 / 600 / 800). Tiada font kedua.
- Semua label rata kiri — **termasuk teks dalam butang**.
- Pemisah utama 2px `#201e1d`; pemisah baris 1px `#d5d3d2`.
- Jarak: kelipatan 4. Padding skrin 20–24px.
- Ikon: **Lucide sahaja**, stroke 2px, saiz 18–28px.

**Keadaan interaksi wajib ditema** (jangan biar default pelayar):
- Butang utama: `#6e1428` → hover `#5d1122` → tekan `#4a0d1b`
- Butang garis: hover isi `rgba(32,30,29,0.07)`, tekan `0.14`
- Fokus papan kekunci: `outline: 2px solid #6e1428; outline-offset: 2px`
- Nyahaktif: `opacity: 0.45`

### 1.3 Susun atur
- Reka bentuk asas **390 × 844** (mobile-first).
- Lebar kandungan maksimum **480px**, dipusatkan pada desktop.
- Tab bar 68px, `border-top: 2px solid #201e1d`, 4 destinasi: **Utama · Rekod · Ringkasan · Tetapan**.
- Tab aktif: maroon + label 800. Tidak aktif: `#8a8785` + 600.

### 1.4 Data
- **Sumber kebenaran ialah Supabase**, bukan simpanan tempatan. Simpanan tempatan hanya cache.
- Semua jadual **wajib** ada Row Level Security. Pengguna hanya nampak rekod sendiri.
- Ikut skema dalam `04-DATA-MODEL.md` **tepat**. Jangan tambah medan tanpa kemas kini dokumen itu dahulu.
- Gambar resit disimpan dalam Supabase Storage, bukan sebagai base64 dalam jadual.

### 1.5 Business rules yang mudah terlepas
- **Tiada auto-simpan.** Setiap resit yang dibaca sistem mesti melalui skrin Semak dan ditekan Simpan oleh pengguna.
- **Setiap item mesti ada kategori** sebelum Simpan boleh ditekan. Item tanpa kategori dipaparkan sebagai chip garis putus.
- **Jumlah item mesti sama dengan hasil tambah baris.** Jika berbeza daripada jumlah pada resit, tunjuk beza — jangan senyap.
- Rekod manual ditanda `tiada_bukti = true` dan dipaparkan dengan chip garis "Tiada bukti".
- App **tidak** kira had pelepasan cukai, **tidak** beri nasihat cukai. Tunjuk jumlah ikut kategori sahaja.

---

## 2. Peraturan JANGAN

| Jangan | Sebab |
|---|---|
| Jangan tambah ciri yang tiada dalam `01-PRD.md` | Skop v1 sudah dipotong dengan sengaja |
| Jangan bina ciri yang disenaraikan "Tangguh" | Termasuk kiraan pelepasan LHDN, sambungan Google Sheet, mod luar talian |
| Jangan guna pustaka UI besar (MUI, Chakra, Ant) | Reka bentuk custom, radius 0 — pustaka ini melawan |
| Jangan cipta kategori baru atau benarkan pengguna cipta | Senarai 12 kategori adalah tetap |
| Jangan salin `ResitLog_UI_dc.html` terus | Ia rujukan reka bentuk, bukan kod produksi. Bina semula sebagai komponen React |
| Jangan letak kunci API dalam kod klien | Panggilan OCR/AI melalui route server sahaja |
| Jangan guna `any` dalam TypeScript | Taip semua |
| Jangan tulis komen yang mengulang kod | Komen jelaskan *kenapa*, bukan *apa* |
| Jangan tukar bahasa UI ke Inggeris | Walaupun untuk placeholder atau data ujian |

---

## 3. Peraturan AUTO-LOG *(wajib)*

Selepas **setiap** tugasan selesai, kemas kini `DEV-LOG.md` di akar projek. Jika fail belum wujud, cipta.

Format setiap entri:

```markdown
## [YYYY-MM-DD HH:MM] — <tajuk ringkas tugasan>

**Fasa:** <nombor fasa dari 09-BUILD-PHASES>
**Status:** Siap | Separuh | Tersekat

### Apa yang dibuat
- <senarai perubahan, satu baris satu perkara>

### Fail disentuh
- `laluan/fail.tsx` — <apa berubah>

### Keputusan yang diambil
- <sebarang keputusan teknikal + sebabnya. Tulis "Tiada" jika tiada>

### Masalah / tersekat
- <apa yang tak jalan, atau "Tiada">

### Langkah seterusnya
- <apa patut buat selepas ini>
```

**Peraturan log:**
1. Entri baru ditambah **di atas** entri lama (paling baru dahulu).
2. Tulis log **selepas** kod siap, bukan sebelum.
3. Jika satu tugasan dipecah beberapa sesi, satu entri satu sesi.
4. Jangan padam entri lama.
5. Jika ada keputusan yang bercanggah dengan dokumen handoff, **catat dalam log dan beritahu pemilik projek** — jangan senyap ubah dokumen.

---

## 4. Cara kerja

1. **Baca dokumen dahulu.** Sebelum mula fasa baru, baca `01-PRD.md`, `04-DATA-MODEL.md` dan `06-ACCEPTANCE-CRITERIA.md` untuk bahagian berkenaan.
2. **Satu fasa satu masa.** Ikut turutan dalam `09-BUILD-PHASES.md`. Jangan lompat.
3. **Siapkan sebelum teruskan.** Satu fasa dikira siap bila semua checklist dalam `06-ACCEPTANCE-CRITERIA.md` untuk fasa itu lulus.
4. **Tanya bila ragu.** Jika dokumen tidak jelas atau bercanggah, berhenti dan tanya. Jangan reka andaian sendiri.
5. **Log selepas siap.** Rujuk Bahagian 3.

---

## 5. Kualiti kod

- TypeScript ketat (`strict: true`).
- Komponen kecil, satu tanggungjawab. Jika satu fail melebihi ~200 baris, pecahkan.
- Server Components secara lalai; `"use client"` hanya bila perlu interaksi.
- Kendalikan keadaan: **memuat**, **kosong**, **ralat** — untuk setiap skrin yang ambil data. Skrin kosong mesti ada teks yang beritahu pengguna apa nak buat seterusnya.
- Akses: setiap butang boleh dicapai papan kekunci, setiap imej ada `alt`, kontras teks sekurang-kurangnya 4.5:1.
- Jangan tulis ujian untuk v1 kecuali diminta — tumpu pada checklist QA manual.

---

## 6. Sasaran prestasi

| Perkara | Sasaran |
|---|---|
| Snap → skrin Semak muncul | ≤ 10 saat |
| Skrin Semak → Simpan (kes biasa) | ≤ 10 saat interaksi pengguna |
| Muat skrin Utama | ≤ 2 saat pada 4G |
| Saiz gambar disimpan | ≤ 300KB selepas dimampat |

Bar kemajuan pada skrin Sedang Baca mesti **bergerak sebenar** mengikut keadaan panggilan, bukan animasi palsu.

---

## 7. Nota persekitaran pembangunan semasa *(tambahan, bukan dari handoff asal)*

- **Peringkat sekarang: bina di tempatan (local) guna data dummy** (`lib/dummy-data.ts`). Supabase (Auth + DB + Storage) dan panggilan Claude API sebenar **disambung last**, sebagai fasa berasingan — bukan pada setiap fasa UI.
- Tailwind versi projek ini ialah **v4** (bukan v3 seperti contoh `tailwind.config.ts` dalam `02-TECH-STACK.md`). Token warna didaftarkan melalui `@theme` dalam `app/globals.css`, bukan fail `tailwind.config.ts`. Nilai token **sama persis** dengan jadual di §1.2 — hanya cara daftar yang berbeza. `border-radius: 0` dan `box-shadow: none` dikuatkuasakan secara global dalam `globals.css` (bukan setakat konfigurasi Tailwind) supaya tiada kelas atau gaya inline boleh terlepas pandang peraturan ini.
- Cawangan kerja: `claude/new-separate-project-wbvswm` pada repo `affitechlab-svg/ResitLog`. Jangan sentuh atau rujuk repo Nexmet / Nexmet-AI.
- `09-BUILD-PHASES.md` belum diterima setakat entri log pertama — pecahan fasa dicadang sementara dalam `DEV-LOG.md` dan `PROGRESS.md`, tertakluk pengesahan pemilik projek.
