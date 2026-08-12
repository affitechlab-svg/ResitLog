# DEV-LOG

Log pembangunan ResitLog. Entri terbaru di atas, ikut format dalam `CLAUDE.md` §3.

---

## [2026-08-11 23:10] — Fasa 5A + 5B: Snap resit, mampat gambar, skrin Semak (data palsu)

**Fasa:** 5 (5A + 5B) — Snap resit dan skrin Semak
**Status:** Siap *(5C — bacaan sebenar melalui Claude API — belum bermula, perlukan `ANTHROPIC_API_KEY`)*

### Apa yang dibuat
- `lib/gambar.ts` — `mampatGambar()`: resize kanvas ke lebar maksimum 1400px, kualiti mula 0.82, kurangkan kualiti lagi (maks 5 percubaan) jika masih melebihi 300KB.
- `lib/konteks-bacaan.tsx` — storan sementara alir Snap/Album → Sedang Baca → Semak. `mulaBacaan()` jana **keputusan bacaan palsu** menggunakan data seed Mydin tepat (`04-DATA-MODEL.md` §8: 42.90+58.00+12.80=113.70), dengan Panadol sengaja tiada kategori supaya alir "Pilih kategori" (BR-02) boleh diuji — sama seperti skrin 06 dalam `ResitLog_UI_dc.html`.
- `komponen/resit/PemilihKategori.tsx`, `SenaraiItem.tsx`, `BarisResit.tsx` — 3 komponen khusus resit ikut struktur folder rasmi dalam `02-TECH-STACK.md`. `BarisResit` menggantikan kod yang bertindih dalam `/rekod` dan `/utama`.
- Skrin **Utama**: butang Snap Resit dan Muat Naik Album kini **berfungsi** (bukan lagi nyahaktif) — buka input fail (`capture="environment"` untuk kamera, tanpa `capture` untuk album), mampat gambar, mula bacaan palsu, alih ke `/semak`.
- Skrin **`/semak`** (satu laluan, dua keadaan ikut status):
  - **Sedang Baca** — skrin ink `#201e1d` penuh, bar kemajuan **bergerak sebenar** (dikira daripada masa berlalu, bukan animasi tetap), pratonton gambar yang dimuat naik, butang Batal dan Masuk manual.
  - **Semak Resit** — semua medan resit boleh diedit (kedai, no. invois, tarikh, jumlah bersempadan maroon), SegmentedControl cara bayar, senarai item dengan chip kategori (tint bila dipilih, garis putus maroon bila belum — via `PemilihKategori`), footer jumlah item dikira semula secara langsung, **beza dipaparkan** bila jumlah item ≠ jumlah pada resit (BR-03), butang Simpan nyahaktif selagi ada item tanpa kategori (BR-02), "Lihat gambar" buka pratonton penuh skrin, dialog amaran bila keluar sebelum simpan.
  - `/semak` tanpa sesi bacaan aktif → alih ke `/utama` (ikut `03-SITEMAP-ROUTING.md` §4).
- Disahkan **hujung ke hujung dalam browser** dengan gambar ujian sebenar (Playwright, `setFiles`): muat naik → Sedang Baca (bar bergerak) → Semak (data Mydin terisi) → uji beza jumlah (RM120 vs RM113.70 → mesej beza RM6.30 betul) → pilih kategori Panadol → Simpan → kembali ke Utama dengan rekod baru muncul dalam Terkini.
- **Dibetulkan semasa ujian:** butang "Batal"/"Masuk manual" pada skrin gelap asalnya guna varian `garis` Butang + `className` untuk timpa warna — tapi kelas Tailwind dari varian menewaskan kelas timpaan (susunan dalam helaian gaya terjana, bukan susunan dalam `class=""`, yang tentukan kemenangan), jadi butang jadi tak kelihatan (teks/sempadan gelap atas gelap). Dibetulkan dengan tulis dua butang ini terus sebagai `<button>` biasa dalam `app/semak/page.tsx`, elak pertembungan kelas sama sekali.
- `npx tsc --noEmit`, `npm run build`, `npx eslint .` semua bersih.

### Fail disentuh
- `lib/gambar.ts` — baru
- `lib/konteks-bacaan.tsx` — baru
- `komponen/resit/PemilihKategori.tsx`, `SenaraiItem.tsx`, `BarisResit.tsx` — baru
- `app/(app)/utama/page.tsx` — aktifkan Snap/Album, guna `BarisResit`
- `app/(app)/rekod/page.tsx` — guna `BarisResit` (buang kod bertindih)
- `app/semak/page.tsx` — baru
- `app/layout.tsx` — tambah `<PembekalBacaan>`

### Keputusan yang diambil
- **Bacaan Fasa 5A/5B 100% palsu (data Mydin seed tetap)**, tidak cuba mock pelbagai jenis resit. Ini ikut arahan eksplisit 5A: "Gunakan data Mydin dari seed". Bacaan sebenar (pelbagai resit, ralat OCR sebenar) itu Fasa 5C.
- **Gambar hanya disimpan sebagai `blob:` URL dalam memori pelayar** (bukan dimuat naik ke mana-mana), dipadam (`URL.revokeObjectURL`) bila sesi bacaan dibatalkan/disiapkan. Ini konsisten dengan "tiada Supabase Storage lagi" dan peraturan "gambar dimuat naik hanya selepas Simpan" — memandangkan storan sebenar belum wujud, rekod yang disimpan set `gambarLaluan: null` buat masa ini.
- **3 komponen `komponen/resit/`** (PemilihKategori, SenaraiItem, BarisResit) dicipta ikut nama tepat dalam `02-TECH-STACK.md` §2, bukan nama pilihan sendiri — supaya struktur kod sepadan dokumen rujukan.

### Masalah / tersekat
- Tiada.

### Langkah seterusnya
- **Fasa 5C perlukan tindakan pemilik projek:** dapatkan kunci API Anthropic (https://console.anthropic.com), letak dalam `.env.local` sebagai `ANTHROPIC_API_KEY=...` (rujuk `.env.local.example`). Beritahu saya bila sudah sedia, dan saya akan bina route handler `/api/baca-resit` + sambungkan bacaan sebenar, gantikan `janaKeputusanPalsu()`.

## [2026-08-11 22:35] — Fasa 4: Ringkasan bulanan (checkpoint)

**Fasa:** 4 — Ringkasan bulanan
**Status:** Siap

### Apa yang dibuat
- Tambah `pecahanKategoriBulan()` dalam `lib/data.ts` — pecahan belanja ikut kategori untuk satu bulan (jumlah + peratus daripada jumlah keseluruhan), disusun besar ke kecil. Dikira semasa dipapar, tidak disimpan (ikut `04-DATA-MODEL.md` §9).
- Tambah `bulanSebelum()` dalam `lib/format.ts` — kunci bulan sebelumnya, untuk perbandingan.
- Bina skrin **Ringkasan** (`/ringkasan`) — SegmentedControl Bulanan/Tahunan (Tahunan berikon kunci untuk Basic), BlokPoster (jumlah bulan ini + perbandingan naik/turun berbanding bulan lepas), baris "Dashboard AI Insight" (dipaparkan tapi nyahaktif — ciri sebenar itu Fasa 9), senarai kategori dengan bar mendatar 8px berkadar peratus, kad upsell Premium, **penafian cukai wajib** (BR-05, teks penuh daripada `05-USER-FLOWS.md`).
- Tekan **Tahunan** semasa pakej Basic memapar **paywall sebenar dalam skrin yang sama** (bukan ralat, bukan alih laman) — kad bersempadan maroon, ikon kunci, butang Naik Premium.
- Keadaan kosong untuk bulan tanpa rekod kategori.
- Disahkan dalam browser: kategori tersusun betul (Perubatan RM162.10 tertinggi → Makanan RM7.40 terendah), bar berkadar peratus, perbandingan "naik RM227.80 daripada Julai" dikira betul, klik Tahunan tukar ke paparan paywall.
- `npx tsc --noEmit`, `npm run build`, `npx eslint .` semua bersih.

### Fail disentuh
- `lib/data.ts` — tambah `pecahanKategoriBulan()`
- `lib/format.ts` — tambah `bulanSebelum()`
- `app/(app)/ringkasan/page.tsx` — baru

### Keputusan yang diambil
- **Kategori kecil TIDAK digabung jadi satu baris "Lain-lain·..."** seperti dalam `ResitLog_UI_dc.html` (mockup gabungkan baki kategori kerana ruang skrin terhad untuk paparan statik). `09-BUILD-PHASES.md` 4.2 hanya minta "senarai kategori...disusun besar ke kecil" — tiada arahan gabung. Setiap kategori yang ada belanja bulan itu dapat barisnya sendiri; lebih tepat dan tak hilang maklumat.
- **Guna teks penafian cukai penuh daripada `05-USER-FLOWS.md`** (Aliran E), bukan versi ringkas dalam mockup — dokumen itu tandakan ia "wajib" dengan perkataan tepat, jadi diguna sepenuhnya, bukan versi dipendekkan.
- **Baris "Dashboard AI Insight" dipaparkan tapi nyahaktif** (opacity 0.45), konsisten dengan cara Snap Resit/Album dipaparkan di Fasa 2 — ciri sebenar (Fasa 9) belum dibina, jadi jangan pautkan ke laluan yang tidak wujud.

### Masalah / tersekat
- Tiada.

### Langkah seterusnya
- **Checkpoint ikut `09-BUILD-PHASES.md`: "Berhenti di sini dan tunjukkan pada pemilik projek."** Fasa 0-4 (asas projek, komponen UI, masuk manual, rekod & butiran, ringkasan bulanan) kini boleh dilihat penuh sebagai satu aliran kerja di `/utama → /manual → /rekod → /rekod/[id] → /ringkasan`. Menunggu pengesahan pemilik projek sebelum mula Fasa 5 (Snap resit — fasa paling berat, perlukan kunci API Anthropic).

## [2026-08-11 22:15] — Fasa 3: Rekod dan butiran

**Fasa:** 3 — Rekod dan butiran
**Status:** Siap

### Apa yang dibuat
- Tambah `kumpulanIkutBulan()` dalam `lib/data.ts` — kumpul senarai resit ikut bulan (terbaru dahulu) dengan jumlah setiap bulan.
- Tambah `padamResit(id)` dalam `lib/konteks-data.tsx`.
- Bina skrin **Rekod** (`/rekod`) — carian nama kedai (tidak sensitif huruf besar/kecil), senarai dikumpul ikut bulan dengan tajuk seksyen latar `surface` + jumlah bulan, baris rekod dengan sehingga 2 chip kategori + "+n" (BR-10), chip "Tiada bukti" untuk rekod manual, keadaan kosong untuk (a) tiada rekod langsung dan (b) carian tanpa hasil.
- Bina skrin **Butiran Resit** (`/rekod/[id]`) — rujukan `#RL-xxxxxx / INVOIS ...`, nama kedai, grid meta 2×2 (tarikh belanja, cara bayar, sumber, direkod), senarai item + kategori + harga, baris Jumlah, seksyen "Gambar asal" (nota "tiada gambar" — pengendalian gambar sebenar itu Fasa 5), ikon padam → dialog pengesahan → padam → kembali ke `/rekod`. Rekod bukan milik pengguna/tiada wujud papar keadaan "tidak dijumpai".
- Disahkan dalam browser (Playwright): senarai + kumpulan bulan + jumlah betul, buka butiran (jumlah item Mydin 42.90+58.00+12.80=113.70 padan), carian sepadan & carian tanpa hasil, padam resit benar-benar buang daripada senarai.
- `npx tsc --noEmit`, `npm run build`, `npx eslint .` semua bersih.

### Fail disentuh
- `lib/data.ts` — tambah `kumpulanIkutBulan()`
- `lib/konteks-data.tsx` — tambah `padamResit()`
- `app/(app)/rekod/page.tsx` — baru
- `app/(app)/rekod/[id]/page.tsx` — baru

### Keputusan yang diambil
- **Seksyen "Gambar asal" pada Butiran Resit tidak cuba mock gambar palsu** — hanya papar nota jujur ("tiada gambar resit" untuk rekod manual, "gambar belum tersedia" untuk rekod bergambar tanpa `gambarLaluan`) kerana `04-DATA-MODEL.md` §9 dan `09-BUILD-PHASES.md` sendiri sisih bahagian gambar ke Fasa 5. Elak bina paparan yang kelihatan berfungsi tetapi sebenarnya palsu.
- **`/rekod/[id]` untuk id yang tiada dipapar sebagai keadaan "tidak dijumpai" dalam halaman**, bukan `notFound()` Next.js sebenar — kerana skrin ini Client Component (baca state Context). Diperhalusi bila Fasa 7 tukar kepada bacaan pelayan sebenar (`03-SITEMAP-ROUTING.md`: "Buka `/rekod/[id]` yang bukan milik pengguna → 404" akan jadi 404 HTTP sebenar pada masa itu).

### Masalah / tersekat
- Tiada.

### Langkah seterusnya
- Mula Fasa 4: skrin Ringkasan bulanan (checkpoint — tunjuk pada pemilik projek sebelum teruskan ke Fasa 5).

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
