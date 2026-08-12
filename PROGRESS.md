# PROGRESS

Papan status peringkat tinggi. Log terperinci setiap tugasan ada dalam `DEV-LOG.md`
(fail wajib ikut `CLAUDE.md` §3 — gantikan rujukan "WORK-LOG.md" dalam `09-BUILD-PHASES.md`,
lihat `CLAUDE.md` §7). Fasa di bawah ikut `09-BUILD-PHASES.md` rasmi.

## FASA 0 — Asas projek ✅ Siap
- ✅ 0.1 Next.js 15 + TypeScript strict + Tailwind
- ✅ 0.2 Token warna (via `@theme` dalam `globals.css`, bukan `tailwind.config.ts` — radius/bayang dimatikan global; lihat `CLAUDE.md` §7)
- ✅ 0.3 Font Archivo via `next/font/google`
- ✅ 0.4 `lucide-react` dipasang
- ✅ 0.5 Struktur folder ikut `02-TECH-STACK.md`
- ✅ 0.6 `lib/kategori.ts`
- ✅ 0.7 `lib/format.ts`
- ✅ 0.8 `jenis/index.ts`
- ✅ 0.9 `lib/data-dummy.ts` (seed data) + `lib/data.ts` (lapisan capaian data)
- ✅ 0.10 `DEV-LOG.md` dan `PROGRESS.md` wujud dan berfungsi
- ✅ **Siap bila:** `npm run build`/`dev` jalan tanpa ralat, halaman ujian papar Archivo + maroon `#6e1428` betul (disahkan dengan screenshot pelayar)

## FASA 1 — Komponen UI asas ✅ Siap
- ✅ `Butang`, `Medan`, `Chip` (isi/garis/garis putus/tint), `SegmentedControl`, `TabBar`, `Dialog`, `BlokPoster`, `KeadaanKosong`
- ✅ Halaman ujian `/ujian-komponen` — disahkan dengan screenshot pelayar

## FASA 2 — Masuk manual + simpan ✅ Siap
- ✅ `/utama` (versi ringkas), `/manual` penuh, simpan ke state dummy — disahkan hujung-ke-hujung dalam browser

## FASA 3 — Rekod dan butiran ✅ Siap
- ✅ `/rekod`, `/rekod/[id]`, carian, padam — disahkan dalam browser

## FASA 4 — Ringkasan bulanan ✅ Siap
- ✅ `/ringkasan` (Bulanan + paywall Tahunan untuk Basic), penafian cukai — disahkan dalam browser
- **Checkpoint aktif:** menunggu pengesahan pemilik projek sebelum mula Fasa 5

## FASA 5 — Snap resit dan skrin Semak — 5A/5B ✅ Siap · 5C 🟡 Kod siap, menunggu kredit
- ✅ 5A: `/semak` dengan data palsu — disahkan hujung ke hujung dalam browser
- ✅ 5B: kamera/album + mampat gambar + skrin Sedang Baca — disahkan dengan muat naik gambar sebenar
- 🟡 5C: `/api/baca-resit` sebenar (Claude Haiku 4.5) — kod siap, disahkan sambung betul ke Claude API (`curl`), **menunggu pemilik projek tambah kredit di Anthropic Console** sebelum ujian hujung-ke-hujung dengan resit sebenar

## FASA 6 — Skrin selebihnya ⬜ Belum
- ⬜ `/mula`, `/daftar`, `/log-masuk` (paparan sahaja), `/tetapan`, `/pasang`, manifest PWA

## FASA 7 — Supabase (data sebenar) ⬜ Belum
- ⬜ Projek Supabase, migrasi SQL + RLS, Storage, Auth (emel/Google/Apple), middleware
- ⬜ Tukar `lib/data.ts` daripada dummy ke Supabase — skrin tidak berubah
- *(Pemilik projek: buka akaun Supabase, salin kunci ke `.env.local`, daftar OAuth app)*

## FASA 8 — Premium ⬜ Belum
- ⬜ Ringkasan Tahunan, paywall, eksport Excel, mod pasangan, bayaran
- *(Harga RM9/bulan belum disahkan — sahkan sebelum bina bahagian bayaran)*

## FASA 9 — Dashboard AI Insight ⬜ Belum *(boleh ditangguh selepas pelancaran)*

## FASA 10 — Hosting dan pelancaran (Railway) ⬜ Belum
- ⬜ Putuskan sambungan Vercel → sambung Railway → domain `resitlog.my`
- *(Pemilik projek: daftar akaun Railway, plan Hobby + kad kredit, beli domain MYNIC)*
