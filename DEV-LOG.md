# DEV-LOG

Log pembangunan ResitLog. Entri terbaru di atas, ikut format dalam `CLAUDE.md` §3.

---

## [2026-08-11 20:45] — Setup projek Next.js + dokumentasi build

**Fasa:** 0 — Setup projek *(dicadang; `09-BUILD-PHASES.md` belum diterima — lihat "Masalah / tersekat")*
**Status:** Siap

### Apa yang dibuat
- Terima dan simpan 6 dokumen spesifikasi + rujukan reka bentuk ke akar repo: `01-PRD.md`, `02-TECH-STACK.md`, `03-SITEMAP-ROUTING.md`, `04-DATA-MODEL.md`, `05-USER-FLOWS.md`, `06-ACCEPTANCE-CRITERIA.md`, `ResitLog_UI_dc.html`.
- Gantikan `CLAUDE.md` ringkas (sesi sebelum ini) dengan `CLAUDE.md` — Peraturan Build ResitLog rasmi yang diberikan pemilik projek, ditambah §7 nota persekitaran pembangunan semasa.
- Scaffold projek Next.js 15 (App Router) + TypeScript strict + Tailwind CSS v4 + ESLint di akar repo.
- Pasang `lucide-react`.
- Cipta token reka bentuk (`ink`, `ground`, `surface`, `maroon`, dsb.) dalam `app/globals.css` melalui `@theme`, sepadan 100% dengan jadual dalam `CLAUDE.md` §1.2.
- Kuatkuasa `border-radius: 0` dan `box-shadow: none` secara global (reset keras dalam CSS, bukan setakat config Tailwind).
- Sediakan fon Archivo (400/500/600/800) melalui `next/font/google` dalam `app/layout.tsx`, `lang="ms"`.
- Cipta struktur folder asas: `komponen/ui`, `komponen/resit`, `lib/`, `lib/supabase` (kosong buat masa ini), `jenis/`, `supabase/migrations` (kosong buat masa ini).
- Cipta `jenis/index.ts` — taip `Pengguna`, `IsiRumah`, `Resit`, `Item`, sepadan `04-DATA-MODEL.md`.
- Cipta `lib/kategori.ts` — katalog 12 kategori tetap.
- Cipta `lib/format.ts` — format RM, tarikh dan nama bulan BM.
- Cipta `lib/dummy-data.ts` — data ujian (1 pengguna, 6 resit, item) diambil terus daripada seed data dalam `04-DATA-MODEL.md` §8, untuk pembangunan tempatan sebelum Supabase disambung.
- Cipta `.env.local.example` (kosong) — senarai pemboleh ubah persekitaran untuk fasa Supabase/Claude API kelak.
- Gantikan halaman lalai Next.js dengan halaman letak sementara BM yang mengesahkan token reka bentuk berfungsi.
- Uji `npm run build` — berjaya.

### Fail disentuh
- `CLAUDE.md` — ditulis semula ikut versi rasmi + §7 tambahan
- `app/layout.tsx` — fon Archivo, metadata BM, `lang="ms"`
- `app/globals.css` — token warna, reset radius/shadow, fokus papan kekunci
- `app/page.tsx` — halaman letak sementara
- `jenis/index.ts` — taip data teras (baru)
- `lib/kategori.ts` — katalog kategori (baru)
- `lib/format.ts` — util format RM/tarikh (baru)
- `lib/dummy-data.ts` — data ujian tempatan (baru)
- `.env.local.example` — senarai env var (baru)
- `.gitignore` — tambah pengecualian untuk `.env.local.example`
- `01–06-*.md`, `ResitLog_UI_dc.html` — disalin ke akar repo (baru)
- `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs` — hasil scaffold `create-next-app`

### Keputusan yang diambil
- **Tailwind v4, bukan v3.** `02-TECH-STACK.md` beri contoh `tailwind.config.ts` gaya v3. `create-next-app` semasa scaffold guna Tailwind v4 (token didaftar dalam CSS melalui `@theme`, bukan fail JS config). Nilai token kekal sama persis; hanya cara daftar berbeza. Radius 0 / tiada bayang dikuatkuasakan sebagai reset CSS global — lebih ketat daripada cadangan asal kerana ia meliputi semua gaya inline juga, bukan setakat kelas Tailwind.
- **Next.js dipin ke v15** (`15.5.23`) supaya sepadan literal dengan `02-TECH-STACK.md`, walaupun `create-next-app@latest` sudah pada v16.
- **DEV-LOG.md menggantikan WORK-LOG.md.** Sesi sebelum ini cipta `WORK-LOG.md` + `PROGRESS.md` sebagai sistem log ringkas sebelum dokumen build rasmi diterima. `CLAUDE.md` rasmi mewajibkan `DEV-LOG.md` dengan format tertentu — jadi `DEV-LOG.md` ini sekarang fail log rasmi. `WORK-LOG.md` dipadam untuk elak dua sistem log berlainan format wujud serentak; entri asalnya (setup dokumentasi awal) dirumuskan semula di atas. `PROGRESS.md` dikekalkan sebagai papan status peringkat tinggi (tidak diwajibkan CLAUDE.md, tapi berguna untuk pemilik projek).
- **Tiada Supabase / Claude API kod ditulis lagi.** Folder `lib/supabase/` dan `supabase/migrations/` dicipta kosong sebagai tempat letak sahaja — ikut arahan pemilik projek: bina tempatan dengan data dummy dahulu, Supabase disambung last.
- **Tiada skrin/halaman ciri (mula, daftar, utama, dll.) dibina lagi.** Setakat ini hanya infrastruktur (setup, token, taip, data dummy). Ini ikut arahan eksplisit "jangan bina semua sekali gus — ikut BUILD-PHASES".

### Masalah / tersekat
- **`09-BUILD-PHASES.md` belum diterima** — fail ini disebut dalam `CLAUDE.md` sebagai "akan menyusul" tetapi belum diupload. Tanpa ia, turutan fasa rasmi tidak boleh disahkan. Dicadangkan pecahan fasa sementara dalam `PROGRESS.md` (Fasa 0–12) untuk pengesahan pemilik projek sebelum kerja ciri (Fasa 1 dan seterusnya) bermula — ikut peraturan §4.4 "tanya bila ragu, jangan reka andaian sendiri".

### Langkah seterusnya
- Tunggu pemilik projek sahkan/betulkan cadangan pecahan fasa dalam `PROGRESS.md` (atau upload `09-BUILD-PHASES.md` sebenar).
- Selepas disahkan, mula Fasa 1: aliran log masuk/daftar (UI sahaja, guna pengguna dummy tetap log masuk — tiada Supabase Auth lagi) + skrin Utama dengan data dummy.
