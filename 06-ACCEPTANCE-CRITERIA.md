# 06 — Acceptance Criteria · ResitLog v1

Checklist QA. Satu bahagian dikira **siap** hanya bila semua kotaknya ditanda.

Tandakan: `[ ]` belum · `[x]` lulus · `[!]` gagal, catat dalam `DEV-LOG.md`

---

## A. Reka bentuk *(semak pada setiap skrin)*

- [ ] Tiada sudut bulat di mana-mana — `border-radius: 0` disahkan
- [ ] Tiada `box-shadow` di mana-mana
- [ ] Tiada gradient
- [ ] Font tunggal Archivo, berat 400/500/600/800 sahaja
- [ ] Semua warna sepadan dengan token dalam `CLAUDE.md` *(bandingkan dengan pemilih warna)*
- [ ] Semua label rata kiri, termasuk teks dalam butang
- [ ] Pemisah utama 2px `#201e1d`; pemisah baris 1px `#d5d3d2`
- [ ] Ikon dari Lucide sahaja, stroke 2px
- [ ] Butang utama: hover `#5d1122`, tekan `#4a0d1b`
- [ ] Fokus papan kekunci: garis luar 2px maroon, offset 2px — nampak pada **setiap** elemen boleh fokus
- [ ] Elemen nyahaktif: opacity 0.45
- [ ] Lebar kandungan maksimum 480px, dipusatkan pada desktop
- [ ] Tab bar 68px dengan `border-top: 2px solid #201e1d`
- [ ] Semua teks Bahasa Melayu — tiada perkataan Inggeris terlepas

---

## B. Auth dan pendaftaran

- [ ] `/mula` memaparkan dua kad; **Pasangan** nyahaktif dengan chip PREMIUM
- [ ] Butang **Daftar** pada `/daftar` kekal nyahaktif sehingga checkbox terma ditanda
- [ ] Emel yang sudah digunakan memberi mesej BM yang jelas, bukan ralat mentah
- [ ] Kata laluan lemah ditolak dengan penjelasan
- [ ] Google OAuth berjaya → masuk `/utama`
- [ ] Apple OAuth berjaya → masuk `/utama`
- [ ] "Lupa kata laluan?" menghantar emel set semula
- [ ] Log masuk salah memberi mesej BM, tidak mendedahkan sama ada emel wujud
- [ ] Pengguna baru → `/pasang` dipapar **sekali sahaja**, kemudian `/utama`
- [ ] Pengguna sudah log masuk cuba buka `/mula` → dialih ke `/utama`
- [ ] Pengguna belum log masuk cuba buka `/rekod` → dialih ke `/mula`
- [ ] Log keluar berjaya dan sesi dibersihkan

---

## C. Snap resit *(ciri teras)*

- [ ] **Snap Resit** membuka kamera peranti terus
- [ ] **Muat Naik dari Album** membuka pemilih fail imej
- [ ] Gambar dimampat ke ≤300KB sebelum dihantar
- [ ] Skrin Sedang Baca ialah skrin ink penuh `#201e1d`
- [ ] Bar kemajuan **bergerak sebenar** mengikut keadaan panggilan — bukan animasi palsu
- [ ] Snap → skrin Semak muncul dalam **≤10 saat** pada 4G
- [ ] Butang **Batal** menghentikan bacaan dan kembali ke `/utama`
- [ ] Butang **Masuk manual** pada skrin baca membawa ke `/manual`
- [ ] Gambar gelap → mesej khusus + dua jalan keluar
- [ ] Bukan resit → mesej khusus + dua jalan keluar
- [ ] Tiada internet → mesej khusus + cuba semula
- [ ] Tamat masa → mesej khusus + dua jalan keluar
- [ ] Tiada mesej ralat teknikal Inggeris terlepas ke pengguna
- [ ] Kunci API Anthropic **tidak** kelihatan dalam kod klien atau rangkaian pelayar
- [ ] Panggilan `/api/baca-resit` ditolak jika tiada sesi sah

---

## D. Skrin Semak *(BR-01, BR-02, BR-03)*

- [ ] Semua medan boleh diedit: kedai, no. invois, tarikh, jumlah
- [ ] Medan **Jumlah** bersempadan maroon
- [ ] Segmented control cara bayar: Tunai / Kad / E-wallet
- [ ] Setiap item memaparkan nama, harga dan chip kategori
- [ ] Item tanpa kategori memaparkan chip **garis putus maroon** "Pilih kategori"
- [ ] Butang **Simpan** **nyahaktif** selagi ada satu item tanpa kategori
- [ ] Tap chip membuka pemilih kategori dengan 12 pilihan
- [ ] Footer melekat memaparkan jumlah item, dikira semula setiap kali harga diubah
- [ ] Seed data Mydin: 42.90 + 58.00 + 12.80 = **RM 113.70** — dipapar betul
- [ ] Jika jumlah item ≠ jumlah pada resit, beza ditunjukkan kepada pengguna
- [ ] **Tiada auto-simpan** — rekod hanya wujud selepas Simpan ditekan
- [ ] Tekan kembali → dialog "Rekod belum disimpan. Buang?"
- [ ] **Lihat gambar** membuka gambar yang dibaca
- [ ] Selepas Simpan → `/utama`, jumlah bulan ini dikemas kini serta-merta
- [ ] Gambar dimuat naik ke Storage **hanya selepas** Simpan

---

## E. Masuk manual *(BR-04)*

- [ ] Chip garis **"Tiada bukti"** dipapar pada header
- [ ] Medan jumlah besar: RM + 52px/800, garis bawah maroon 2px
- [ ] Grid 12 chip kategori; yang terpilih jadi isi maroon
- [ ] Hanya **satu** kategori boleh dipilih
- [ ] Medan tarikh lalai hari ini
- [ ] Butang Simpan nyahaktif jika jumlah kosong, ≤0, atau kategori belum dipilih
- [ ] Nota penjelasan tanda "tiada bukti" dipapar
- [ ] Rekod disimpan dengan `sumber='manual'`, `tiada_bukti=true`, `gambar_laluan=null`
- [ ] Rekod muncul dalam `/rekod` dengan chip garis "Tiada bukti"

---

## F. Rekod dan butiran

- [ ] `/rekod` mengumpulkan rekod ikut bulan dengan tajuk seksyen latar `#eae9e9`
- [ ] Setiap tajuk bulan memaparkan jumlah bulan itu
- [ ] Baris rekod: kedai, chip kategori + "+n", jumlah, tarikh
- [ ] Rekod manual memaparkan chip garis "Tiada bukti"
- [ ] Carian nama kedai berfungsi dan tidak sensitif huruf besar/kecil
- [ ] Carian tanpa hasil memaparkan mesej BM yang berguna
- [ ] Tap baris → `/rekod/[id]`
- [ ] Butiran memaparkan `#RL-000142 / INVOIS INV-8823419`
- [ ] Grid meta 2×2: Tarikh belanja · Cara bayar · Sumber · Direkod
- [ ] Senarai item memaparkan nama, kategori maroon, harga
- [ ] Baris **Jumlah** 24px/800
- [ ] Blok gambar asal dengan nama fail dan saiz
- [ ] **Buka penuh** memaparkan gambar penuh skrin
- [ ] Rekod manual memaparkan nota "tiada gambar" dan bukan blok kosong
- [ ] Ikon `trash` → dialog pengesahan → padam resit, item **dan** gambar dari Storage
- [ ] Rekod milik pengguna lain memberi 404

---

## G. Ringkasan *(BR-05)*

- [ ] Blok poster maroon: bulan, jumlah 34px, perbandingan bulan lepas
- [ ] Segmented control Bulanan / Tahunan
- [ ] Tahunan berikon `lock` untuk pengguna Basic
- [ ] Basic tekan Tahunan → paywall, bukan ralat
- [ ] Premium tekan Tahunan → jumlah setahun ikut kategori
- [ ] Senarai kategori disusun dari besar ke kecil
- [ ] Bar mendatar 8px, panjang berkadar dengan nilai
- [ ] Baris masuk "Dashboard AI Insight ›" berlatar maroon tint
- [ ] Kad upsell Premium dipapar untuk Basic sahaja
- [ ] **Penafian cukai dipapar** — app tidak kira had pelepasan, bukan nasihat cukai
- [ ] Bulan tanpa rekod memaparkan keadaan kosong yang berguna, bukan RM 0.00 kosong

---

## H. Dashboard AI Insight *(BR-07)*

- [ ] Premium: dashboard penuh tanpa bar percubaan
- [ ] Basic dalam 30 hari: bar percubaan maroon tint dengan **baki hari yang betul**
- [ ] Baki hari dikira dari `dashboard_habis_pada`, bukan nombor tetap
- [ ] Blok purata 6 bulan: angka 32px + delta maroon
- [ ] Carta bar 6 bulan; bulan semasa maroon, lain `#cbc9c8`
- [ ] Tiga kad insight dengan sempadan kiri 3px maroon
- [ ] Senarai perubahan kategori: naik maroon, turun kelabu
- [ ] Tap kad insight → `/rekod` ditapis
- [ ] Tap bar carta → bulan berkenaan
- [ ] Basic selepas 30 hari: kandungan kabur *(blur 1.5px, opacity 0.28)*
- [ ] Kad paywall bersempadan maroon dengan empat baris faedah
- [ ] Butang **Naik Premium — RM9/bulan**
- [ ] **Nota bahawa snap dan simpan kekal bebas pada Basic dipapar dengan jelas**
- [ ] Pengguna baru dengan <2 bulan data: keadaan kosong yang berguna, bukan carta kosong

---

## I. Tetapan *(BR-08)*

- [ ] Seksyen Akaun: nama, tarikh mula, mod, baris Pakej
- [ ] Butang **Naik Premium** 38px
- [ ] Eksport ke Excel berikon `lock` + chip PREMIUM untuk Basic
- [ ] Mod pasangan berikon `lock` + chip PREMIUM untuk Basic
- [ ] Item terkunci **kelihatan**, bukan disembunyikan
- [ ] Premium: eksport menghasilkan fail Excel yang boleh dibuka
- [ ] Fail eksport mengandungi semua resit dan item dengan tajuk lajur BM
- [ ] Kotak bahaya bersempadan maroon
- [ ] **Padam semua data** memerlukan dialog **dan** taip semula `PADAM`
- [ ] Butang padam nyahaktif sehingga `PADAM` ditaip tepat
- [ ] Dialog menyatakan tindakan tidak boleh dibatalkan
- [ ] Padam berjaya membuang semua resit, item dan gambar; akaun kekal
- [ ] Versi app dipapar di footer

---

## J. PWA dan pemasangan

- [ ] Manifest: nama ResitLog, `display: standalone`, `theme_color: #6e1428`
- [ ] Ikon 192px dan 512px — petak maroon dengan huruf "RL"
- [ ] Service worker mencache shell app
- [ ] Chrome: **Tambah sekarang** mencetuskan `beforeinstallprompt`
- [ ] Safari: arahan 3 langkah dipapar *(tiada API)*
- [ ] Skrin `/pasang` memaparkan pratonton ikon shortcut
- [ ] Selepas dipasang, app dibuka dalam mod standalone tanpa bar alamat
- [ ] `/pasang` boleh dibuka semula dari Tetapan

---

## K. Keselamatan data

- [ ] RLS dihidupkan pada **setiap** jadual
- [ ] Pengguna A tidak boleh baca resit pengguna B *(uji dengan dua akaun)*
- [ ] Bucket Storage peribadi; akses melalui signed URL sahaja
- [ ] Signed URL tamat tempoh selepas 1 jam
- [ ] `SUPABASE_SERVICE_ROLE_KEY` tidak muncul dalam bundle klien
- [ ] `ANTHROPIC_API_KEY` tidak muncul dalam bundle klien
- [ ] Padam resit membuang gambarnya dari Storage — tiada fail yatim
- [ ] Medan `pemilik` sentiasa ditulis walaupun dalam mod solo *(BR-06)*

---

## L. Prestasi

- [ ] `/utama` dimuat dalam ≤2 saat pada 4G
- [ ] Snap → Semak dalam ≤10 saat
- [ ] Bundle JS awal ≤150KB gzip
- [ ] Gambar disimpan ≤300KB
- [ ] Senarai 200 resit menatal lancar tanpa tersekat

---

## M. Keadaan skrin *(setiap skrin yang ambil data)*

- [ ] Keadaan **memuat** ada
- [ ] Keadaan **kosong** ada, dengan teks yang beritahu pengguna apa nak buat
- [ ] Keadaan **ralat** ada, dengan cara pulih
- [ ] Tiada skrin putih kosong dalam mana-mana keadaan

---

## N. Akses

- [ ] Setiap butang boleh dicapai dan diaktifkan dengan papan kekunci
- [ ] Turutan tab mengikut susunan visual
- [ ] Setiap imej ada `alt` Bahasa Melayu
- [ ] Kontras teks sekurang-kurangnya 4.5:1
- [ ] Teks putih atas maroon `#6e1428` lulus semakan kontras
- [ ] Medan borang ada label, bukan placeholder sahaja
- [ ] Mesej ralat borang dikaitkan dengan medannya

---

## O. Semakan akhir sebelum lepas

- [ ] Semua checklist A–N lulus
- [ ] `DEV-LOG.md` lengkap dan terkini
- [ ] Diuji pada iPhone Safari sebenar
- [ ] Diuji pada Android Chrome sebenar
- [ ] Diuji pada desktop
- [ ] **Pemilik projek telah guna app selama 14 hari penuh dengan resit sebenar**
- [ ] Sekurang-kurangnya 30 resit sebenar berjaya direkod semasa ujian itu
- [ ] Kadar kegagalan bacaan resit ≤15% dalam ujian itu

Butir terakhir bukan formaliti. Ia menjawab satu soalan yang tidak boleh dijawab oleh mana-mana ujian teknikal: **adakah orang sanggup guna app ini setiap hari?**
