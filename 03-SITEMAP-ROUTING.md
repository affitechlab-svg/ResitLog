# 03 — Sitemap & Routing · ResitLog v1

14 skrin. Semua laluan dalam Bahasa Melayu.

---

## 1. Senarai laluan penuh

| # | Skrin | Laluan URL | Auth | Tab bar | Nota |
|---|---|---|---|---|---|
| 01 | Mula / Daftar | `/mula` | Tidak | Tiada | Skrin pertama kali buka |
| 02 | Daftar | `/daftar` | Tidak | Tiada | |
| 03 | Log Masuk | `/log-masuk` | Tidak | Tiada | |
| 04 | Utama | `/utama` | Ya | **Utama** | Laluan lalai selepas log masuk |
| 05 | Sedang Baca | `/semak?status=baca` | Ya | Tiada | Skrin ink penuh |
| 06 | Semak Resit | `/semak` | Ya | Tiada | |
| 07 | Masuk Manual | `/manual` | Ya | Tiada | |
| 08 | Rekod | `/rekod` | Ya | **Rekod** | |
| 09 | Butiran Resit | `/rekod/[id]` | Ya | **Rekod** | |
| 10 | Ringkasan | `/ringkasan` | Ya | **Ringkasan** | |
| 11 | Tetapan | `/tetapan` | Ya | **Tetapan** | |
| 12 | Tambah ke Skrin Utama | `/pasang` | Ya | Tiada | |
| 13 | Dashboard AI Insight | `/ringkasan/dashboard` | Ya | **Ringkasan** | Premium / percubaan aktif |
| 14 | Dashboard terkunci | `/ringkasan/dashboard` | Ya | **Ringkasan** | Sama laluan — keadaan berbeza |

**Nota penting tentang 13 dan 14:** kedua-duanya laluan yang sama. Server menyemak status pengguna dan memaparkan versi aktif atau versi terkunci. Bukan dua halaman berasingan.

**Nota tentang 05 dan 06:** satu halaman, dua keadaan. `ocrStatus = reading` → paparan 05. `ocrStatus = ok` → paparan 06. Ini elak kehilangan data bila pengguna tekan kembali.

---

## 2. Struktur kumpulan laluan

```
app/
├─ (auth)/                    ← tiada tab bar, tolak jika sudah log masuk
│  ├─ mula/
│  ├─ daftar/
│  └─ log-masuk/
│
├─ (app)/                     ← ada tab bar, perlu log masuk
│  ├─ layout.tsx              ← tab bar 4 destinasi
│  ├─ utama/
│  ├─ rekod/
│  │  └─ [id]/
│  ├─ ringkasan/
│  │  └─ dashboard/
│  └─ tetapan/
│
├─ semak/                     ← perlu log masuk, TIADA tab bar (skrin fokus)
├─ manual/                    ← perlu log masuk, TIADA tab bar
└─ pasang/                    ← perlu log masuk, TIADA tab bar
```

**Sebab `/semak` dan `/manual` di luar `(app)`:** kedua-duanya skrin tugasan berfokus dengan footer melekat. Tab bar akan mengganggu dan menggalakkan pengguna keluar separuh jalan.

---

## 3. Tab bar

Empat destinasi, sama pada setiap skrin bertab:

| Label | Laluan | Ikon Lucide |
|---|---|---|
| Utama | `/utama` | `home` |
| Rekod | `/rekod` | `list` |
| Ringkasan | `/ringkasan` | `bar-chart` |
| Tetapan | `/tetapan` | `settings` |

- Aktif: maroon `#6e1428`, label berat 800
- Tidak aktif: `#8a8785`, label berat 600
- Tinggi 68px, `border-top: 2px solid #201e1d`
- `/rekod/[id]` mengekalkan tab **Rekod** sebagai aktif
- `/ringkasan/dashboard` mengekalkan tab **Ringkasan** sebagai aktif

---

## 4. Peraturan pengalihan (redirect)

| Keadaan | Tindakan |
|---|---|
| Belum log masuk, cuba buka laluan terlindung | → `/mula` |
| Sudah log masuk, buka `/mula`, `/daftar`, `/log-masuk` | → `/utama` |
| Buka `/` (akar) | → `/utama` jika log masuk, `/mula` jika tidak |
| Log masuk kali pertama | → `/pasang` sekali sahaja, kemudian `/utama` |
| Buka `/semak` tanpa gambar dalam sesi | → `/utama` |
| Buka `/rekod/[id]` yang bukan milik pengguna | → 404 |
| Pengguna Basic buka `/ringkasan/dashboard` selepas 30 hari | Papar keadaan terkunci (14), bukan alih |

Semakan auth dibuat dalam middleware Next.js, bukan dalam komponen klien.

---

## 5. Aliran navigasi

```
01 /mula ──┬─► 02 /daftar ──┐
           └─► 03 /log-masuk┴─► 12 /pasang (kali pertama) ─► 04 /utama

04 /utama ─► Snap Resit ────────► 05 baca ─► 06 /semak ─► Simpan ─► 04
04 /utama ─► Muat Naik Album ───► 05 baca ─► 06 /semak ─► Simpan ─► 04
04 /utama ─► Masuk Manual ──────► 07 /manual ─────────► Simpan ─► 04
04 /utama ─► "Semua rekod" ─────► 08 /rekod
04 /utama ─► tap baris Terkini ─► 09 /rekod/[id]

Tab Rekod ─────► 08 /rekod ─► tap baris ─► 09 /rekod/[id]
Tab Ringkasan ─► 10 /ringkasan ─► "Dashboard AI Insight" ─► 13/14 /ringkasan/dashboard
Tab Tetapan ───► 11 /tetapan ─┬─► 12 /pasang
                              └─► Naik Premium
```

---

## 6. Butang kembali

| Skrin | Kembali ke |
|---|---|
| 02 Daftar | `/mula` |
| 03 Log Masuk | `/mula` |
| 06 Semak | `/utama` — **dengan dialog amaran** kerana data belum disimpan |
| 07 Manual | `/utama` — dengan dialog amaran jika ada isian |
| 09 Butiran | `/rekod` |
| 12 Pasang | halaman sebelumnya |
| 13/14 Dashboard | `/ringkasan` |

Butang kembali pada 05 (Sedang Baca) ialah **Batal** — ia hentikan bacaan dan kembali ke `/utama`.

---

## 7. Gating Premium

| Laluan / ciri | Basic | Premium |
|---|---|---|
| `/ringkasan` mod Bulanan | ✓ | ✓ |
| `/ringkasan` mod Tahunan | 🔒 paywall | ✓ |
| `/ringkasan/dashboard` | ✓ 30 hari pertama, kemudian 🔒 | ✓ |
| Eksport dalam `/tetapan` | 🔒 | ✓ |
| Mod pasangan dalam `/tetapan` | 🔒 | ✓ |

Item terkunci **tetap dipaparkan** dalam UI dengan ikon `lock` dan chip "PREMIUM" — jangan sembunyikan. Pengguna perlu nampak apa yang mereka boleh dapat.

---

## 8. Metadata halaman

Setiap halaman menetapkan tajuk dalam Bahasa Melayu:

| Laluan | `<title>` |
|---|---|
| `/mula` | ResitLog — Simpan resit belanja harian |
| `/utama` | Utama · ResitLog |
| `/rekod` | Rekod · ResitLog |
| `/rekod/[id]` | *(nama kedai)* · ResitLog |
| `/ringkasan` | Ringkasan · ResitLog |
| `/tetapan` | Tetapan · ResitLog |
| `/semak` | Semak resit · ResitLog |
| `/manual` | Masuk manual · ResitLog |

Halaman terlindung ditetapkan `robots: noindex`.
