# DEV-LOG

Log pembangunan ResitLog. Entri terbaru di atas, ikut format dalam `CLAUDE.md` §3.

---

## [2026-08-11 21:55] — Fasa 2: Masuk manual + simpan

**Fasa:** 2 — Masuk manual + simpan
**Status:** Siap

### Apa yang dibuat
- Cipta storan data dalam memori (`lib/konteks-data.tsx`) — Context React yang pegang senarai resit dan sediakan `tambahResit()`. Dibalut sekitar seluruh app dalam `app/layout.tsx` supaya `/manual` dan `/utama` kongsi state yang sama semasa navigasi.
- Tambah `bulanTerkiniData()` dan `ringkasanBulan()` dalam `lib/data.ts` — kira jumlah/bilangan resit/bilangan kategori untuk sesuatu bulan (dipakai semula di Fasa 4).
- Tambah `labelCaraBayar()` dalam `lib/format.ts`.
- Bina `(app)/layout.tsx` — bingkai lebar 480px + TabBar melekat bawah, dikongsi oleh skrin bertab.
- Bina skrin **Utama** (`/utama`, versi ringkas) — header RESITLOG/pakej, BlokPoster jumlah bulan ini, 3 butang aksi (Snap Resit & Muat Naik Album nyahaktif buat masa ini — akan diaktifkan Fasa 5; Masuk Manual berfungsi), senarai Terkini dengan keadaan kosong.
- Bina skrin **Masuk Manual** penuh (`/manual`) — medan jumlah besar RM/52px dengan garis bawah maroon, medan "Untuk apa", grid 12 chip kategori (satu boleh pilih), medan tarikh (lalai hari ini), nota "tiada bukti", footer Simpan.
- Butang Simpan nyahaktif selagi jumlah kosong/≤0 atau kategori belum dipilih (BR mudah terlepas §1.5).
- Butang kembali pada `/manual` papar dialog amaran jika ada isian, ikut `03-SITEMAP-ROUTING.md` §6.
- Rekod manual disimpan dengan `sumber:'manual'`, `tiadaBukti:true`, `caraBayar:'tunai'`, satu item, `pemilik:'bersama'`.
- Ubah `/` (akar) supaya terus alih ke `/utama` — belum ada auth sebenar, pengguna dummy dianggap sentiasa log masuk.
- Diuji dalam browser hujung-ke-hujung (Playwright): Utama → Masuk Manual → isi → Simpan → kembali ke Utama dengan jumlah bulan/bilangan resit/senarai Terkini terkemas kini serta-merta; disahkan juga keadaan nyahaktif Simpan dan dialog amaran keluar.
- `npx tsc --noEmit`, `npm run build`, `npx eslint .` semua bersih.

### Fail disentuh
- `lib/konteks-data.tsx` — baru, storan dalam memori + `useDataResit()`
- `lib/data.ts` — tambah `bulanTerkiniData()`, `ringkasanBulan()`
- `lib/format.ts` — tambah `labelCaraBayar()`
- `app/layout.tsx` — balut `<PembekalDataDummy>`
- `app/(app)/layout.tsx` — baru, bingkai + TabBar
- `app/(app)/utama/page.tsx` — baru
- `app/manual/page.tsx` — baru
- `app/page.tsx` — tukar daripada halaman letak kepada `redirect("/utama")`

### Keputusan yang diambil
- **"Bulan ini" pada fasa data dummy dikira daripada tarikh resit paling terkini dalam senarai**, bukan jam sistem sebenar — supaya UI sentiasa ada data untuk dipapar tanpa kira bila dev server dijalankan (seed data sengaja berpusat Ogos 2026). Dicatat sebagai fungsi berasingan `bulanTerkiniData()` supaya mudah dibuang bila Fasa 7 guna bulan kalendar sebenar.
- **Snap Resit dan Muat Naik Album dipaparkan tetapi nyahaktif** buat masa ini (bukan disembunyikan) — ciri sebenarnya Fasa 5. Ini konsisten dengan gaya app menunjukkan ciri terkunci/belum sedia dengan jelas (rujuk cara Premium dipaparkan dalam reka bentuk), bukan menyembunyikannya.
- **Butang navigasi guna `router.push()`, bukan `<Link>` membalut `<Butang>`** — elak elemen interaktif bersarang (`<button>` dalam `<a>`) yang tidak sah dari segi HTML/akses.

### Masalah / tersekat
- Tiada.

### Langkah seterusnya
- Mula Fasa 3: skrin Rekod (senarai ikut bulan + carian) dan Butiran Resit.

## [2026-08-11 21:30] — Fasa 1: Komponen UI asas

**Fasa:** 1 — Komponen UI asas
**Status:** Siap

### Apa yang dibuat
- Bina 8 komponen dalam `komponen/ui/`: `Butang`, `Medan`, `Chip`, `SegmentedControl`, `TabBar`, `Dialog`, `BlokPoster`, `KeadaanKosong` + barrel export `index.ts`.
- Cipta halaman ujian `/ujian-komponen` yang memaparkan semua komponen (semua varian) untuk banding dengan `ResitLog_UI_dc.html`.
- Sahkan dalam browser (screenshot penuh + interaksi Dialog "taip ulang PADAM"): sudut tajam, warna token, fon Archivo 800, label rata kiri, dan logik nyahaktif/aktif semua betul.

### Fail disentuh
- `komponen/ui/Butang.tsx` — varian `utama` (maroon), `ink`, `garis`; tinggi boleh ubah; nyahaktif opacity 0.45
- `komponen/ui/Medan.tsx` — input berlabel, varian `tegas` (sempadan maroon untuk medan Jumlah), ralat berkait `aria-describedby`
- `komponen/ui/Chip.tsx` — varian `isi`, `garis`, `garis-putus`, `tint`; render `<span>` bila statik, `<button>` bila interaktif
- `komponen/ui/SegmentedControl.tsx` — untuk Cara Bayar dan Bulanan/Tahunan, sokong ikon kunci
- `komponen/ui/TabBar.tsx` — 4 destinasi ikut `03-SITEMAP-ROUTING.md`, guna `usePathname` untuk keadaan aktif
- `komponen/ui/Dialog.tsx` — pengesahan biasa + mod taip-ulang-teks (BR-08)
- `komponen/ui/BlokPoster.tsx` — varian besar (skrin Utama, 52px) dan kecil (skrin Ringkasan, 34px)
- `komponen/ui/KeadaanKosong.tsx` — tajuk + mesej tindakan + slot aksi
- `app/ujian-komponen/page.tsx` — halaman ujian (baru, sementara — bukan laluan rasmi)

### Keputusan yang diambil
- **`SegmentedControl` diberi prop `warnaAktif` (`ink` | `maroon`)** kerana rujuk reka bentuk sendiri tidak konsisten: keadaan aktif "Cara Bayar" pada skrin Semak guna maroon, tetapi "Bulanan/Tahunan" pada skrin Ringkasan guna ink. Dua contoh sebenar dalam `ResitLog_UI_dc.html`, bukan andaian — jadi dibuat boleh ubah ikut konteks panggilan, bukan dipaksa satu warna.
- **Varian Butang `ink` guna opacity untuk hover/tekan** (bukan warna baru) kerana `CLAUDE.md` §1.2 hanya bagi token hover/tekan untuk varian maroon. Elak reka warna yang tiada dalam spesifikasi.
- **Chip render sebagai `<span>` (statik) atau `<button>` (bila ada `onClick`)** — elak `<button>` bersarang dalam baris yang sudah boleh diklik (cth. baris rekod), dan kekal boleh tekan bila memang perlu (pemilih kategori).
- **Halaman `/ujian-komponen` bukan laluan rasmi** — tiada dalam `03-SITEMAP-ROUTING.md`. Disediakan semata-mata untuk QA visual Fasa 1 (arahan eksplisit dalam `09-BUILD-PHASES.md`: "satu halaman ujian memaparkan semua komponen"). Boleh dibuang atau digantikan pintu masuk dev sebelum pelancaran.

### Masalah / tersekat
- Tiada.

### Langkah seterusnya
- Mula Fasa 2: skrin Utama (versi ringkas) + Masuk Manual penuh, simpan ke state dummy dalam memori.

## [2026-08-11 21:05] — Terima 09-BUILD-PHASES.md + tukar hosting ke Railway

**Fasa:** 0 — Asas projek
**Status:** Siap

### Apa yang dibuat
- Simpan `09-BUILD-PHASES.md` rasmi ke akar repo (belum wujud sebelum ini).
- Gantikan `02-TECH-STACK.md` dengan versi kemas kini: hosting **Railway** (bukan Vercel).
- Kemas kini `CLAUDE.md`: baris rujukan `02-TECH-STACK.md` sebut Railway; §7 ditambah nota Railway + resolusi nama fail log.
- Tulis semula `PROGRESS.md` mengikut pecahan Fasa 0–10 **rasmi** daripada `09-BUILD-PHASES.md`, gantikan cadangan sementara sesi lepas.
- Namakan semula `lib/dummy-data.ts` → `lib/data-dummy.ts` (padan dengan nama fail dalam `09-BUILD-PHASES.md` §"Data dummy").
- Cipta `lib/data.ts` — lapisan capaian data tunggal (`penggunaSemasa()`, `senaraiResitPenuh()`, `resitPenuhMengikutId()`) yang dibaca daripada `lib/data-dummy.ts` buat masa ini; fungsi ini sahaja akan ditukar pada Fasa 7, ikut prinsip dalam `09-BUILD-PHASES.md`.
- Buang fungsi `resitPenuhUjian()` yang bertindih daripada `lib/data-dummy.ts` (kini hanya seed data mentah).
- Jalankan `npm run build` semula — sahkan tiada ralat selepas perubahan.

### Fail disentuh
- `09-BUILD-PHASES.md` — baru, disalin daripada dokumen rasmi
- `02-TECH-STACK.md` — digantikan versi Railway
- `CLAUDE.md` — kemas kini rujukan hosting + nota §7
- `PROGRESS.md` — ditulis semula ikut Fasa 0–10 rasmi
- `lib/data-dummy.ts` — namakan semula daripada `dummy-data.ts`, buang fungsi bertindih
- `lib/data.ts` — baru, lapisan capaian data

### Keputusan yang diambil
- **`DEV-LOG.md` kekal sebagai fail log rasmi**, walaupun `09-BUILD-PHASES.md` menyebut `WORK-LOG.md` beberapa kali. `CLAUDE.md` (fail yang sama menyebut format log dalam §3) menang bila dokumen bercanggah, ikut peraturan baris pertama `CLAUDE.md` sendiri. Tiada fail `WORK-LOG.md` baru dicipta.
- **Tiada perubahan kod diperlukan untuk tukar hosting ke Railway** pada peringkat ini — Next.js tidak bergantung platform, dan projek ini tidak pernah ada fail konfigurasi khusus Vercel (`vercel.json` dsb.). Kesan sebenar (disconnect Vercel, connect Railway, domain, env vars) hanya berlaku pada Fasa 10.
- **`lib/data.ts` dicipta awal (Fasa 0)** walaupun fungsi di dalamnya minimum (baru 3 fungsi) — ikut arahan eksplisit `09-BUILD-PHASES.md` supaya skrin sentiasa baca melalui satu lapisan ini, bukan terus daripada `lib/data-dummy.ts`. Fungsi tambahan (cth. simpan, padam, cari) akan ditambah pada Fasa 2/3 apabila skrin berkenaan dibina — tidak direka lebih awal daripada keperluan.

### Masalah / tersekat
- Tiada.

### Langkah seterusnya
- Fasa 0 kini **siap sepenuhnya** ikut checklist rasmi.
- **Perlu makluman kepada pemilik projek (bukan tindakan kod):** repo GitHub `affitechlab-svg/ResitLog` mungkin sudah bersambung ke Vercel secara automatik (integrasi GitHub App). Sila semak dan putuskan sambungan itu (Vercel → Settings → Git → Disconnect) — tapi ini hanya perlu **sebelum Fasa 10**, tidak menghalang kerja sekarang.
- Mula Fasa 1: bina komponen UI asas (`Butang`, `Medan`, `Chip`, `SegmentedControl`, `TabBar`, `Dialog`, `BlokPoster`, `KeadaanKosong`) dalam `komponen/ui/`, banding dengan `ResitLog_UI_dc.html`.

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
