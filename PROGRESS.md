# PROGRESS

Papan status peringkat tinggi. Log terperinci setiap tugasan ada dalam `DEV-LOG.md`
(itulah fail wajib ikut `CLAUDE.md`). Fail ini untuk pandangan pantas sahaja.

> **Nota:** `09-BUILD-PHASES.md` belum diterima daripada pemilik projek. Pecahan fasa
> di bawah ini **cadangan sementara** berdasarkan dokumen 01–06 + susunan yang diminta
> ("local + dummy data dulu, Supabase last"). Sila sahkan atau betulkan sebelum Fasa 1 bermula.

## Fasa 0 — Setup projek ✅ Siap
- ✅ Terima & simpan dokumen spesifikasi (01–06, CLAUDE.md, rujukan UI)
- ✅ Scaffold Next.js 15 + TypeScript + Tailwind v4 + ESLint
- ✅ Token reka bentuk, fon Archivo, reset radius/shadow
- ✅ Struktur folder (`komponen/`, `lib/`, `jenis/`)
- ✅ Taip data teras (`jenis/index.ts`) + katalog kategori
- ✅ Data dummy (`lib/dummy-data.ts`) daripada seed data rasmi
- ✅ `npm run build` disahkan berjaya

## Fasa 1 — Aliran auth (UI + dummy, tiada Supabase lagi) ⬜ Belum
- ⬜ `/mula`, `/daftar`, `/log-masuk` (UI sahaja — "log masuk" guna pengguna ujian tetap)
- ⬜ `/pasang` (skrin tambah ke skrin utama)
- ⬜ Layout `(app)` + tab bar 4 destinasi

## Fasa 2 — Skrin Utama ⬜ Belum
- ⬜ `/utama` dengan jumlah bulan ini, resit terkini (data dummy)

## Fasa 3 — Snap & Semak resit ⬜ Belum
- ⬜ `/semak` (dua keadaan: Sedang Baca + Semak) — guna hasil "bacaan" tiruan (mock), bukan panggilan Claude API sebenar lagi
- ⬜ Kompresi gambar, validasi kategori wajib, kiraan jumlah vs beza

## Fasa 4 — Masuk manual ⬜ Belum
- ⬜ `/manual`

## Fasa 5 — Rekod & Butiran ⬜ Belum
- ⬜ `/rekod` (senarai ikut bulan + carian)
- ⬜ `/rekod/[id]` (butiran + gambar)

## Fasa 6 — Ringkasan ⬜ Belum
- ⬜ `/ringkasan` (Bulanan + Tahunan/paywall)

## Fasa 7 — Dashboard AI Insight ⬜ Belum
- ⬜ `/ringkasan/dashboard` (keadaan aktif + terkunci)

## Fasa 8 — Tetapan ⬜ Belum
- ⬜ `/tetapan` (termasuk padam semua data — dummy dahulu)

## Fasa 9 — PWA ⬜ Belum
- ⬜ Manifest, ikon, service worker shell cache

## Fasa 10 — Sambung Supabase sebenar ⬜ Belum
- ⬜ Auth (emel/kata laluan, Google, Apple)
- ⬜ Jadual + RLS ikut `04-DATA-MODEL.md`
- ⬜ Storage (bucket peribadi, signed URL)
- ⬜ Ganti semua data dummy dengan data sebenar

## Fasa 11 — Sambung Claude API sebenar ⬜ Belum
- ⬜ `/api/baca-resit` panggil Anthropic API betul-betul (ganti mock Fasa 3)

## Fasa 12 — QA & pelancaran ⬜ Belum
- ⬜ Checklist penuh `06-ACCEPTANCE-CRITERIA.md`
- ⬜ Ujian sendiri 14 hari (per `01-PRD.md` §10)
