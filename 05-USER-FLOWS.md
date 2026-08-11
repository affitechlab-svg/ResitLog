# 05 — User Flows · ResitLog v1

Setiap aliran ditulis dari sudut pengguna: apa mereka nampak, apa mereka buat, apa sistem buat.

---

## Aliran A — Pengguna baru mula guna

**Matlamat:** dari buka app kali pertama hingga sedia merekod.

| Langkah | Pengguna nampak | Pengguna buat | Sistem buat |
|---|---|---|---|
| 1 | `/mula` — nama brand, tagline, dua kad "Cara guna" | Pilih **Sendiri** *(Pasangan nyahaktif, berchip PREMIUM)* | Simpan pilihan sementara |
| 2 | | Tekan **Daftar akaun** | → `/daftar` |
| 3 | `/daftar` — Nama, Emel, Kata laluan, checkbox terma | Isi tiga medan, tanda checkbox | Butang Daftar aktif hanya selepas checkbox ditanda |
| 4 | | Tekan **Daftar** | Cipta akaun, cipta baris `pengguna`, tetapkan `dashboard_habis_pada = hari ini + 30` |
| 5 | `/pasang` — arahan tambah ke skrin utama | Tekan **Tambah sekarang** atau **Nanti** | Tanda `pasang_ditunjuk = true` |
| 6 | `/utama` — jumlah RM 0.00, tiga butang aksi | — | Sedia |

**Jalan alternatif:** Google atau Apple OAuth pada langkah 3-4. Selepas berjaya, minta nama jika tiada, kemudian teruskan ke langkah 5.

**Pengguna sedia ada:** `/mula` → **Log masuk** → `/log-masuk` → isi emel + kata laluan → `/utama`. Skrin `/pasang` dilangkau jika `pasang_ditunjuk = true`.

---

## Aliran B — Snap resit *(aliran paling kerap)*

**Matlamat:** rekod satu resit dalam ≤10 saat.

| Langkah | Pengguna nampak | Pengguna buat | Sistem buat |
|---|---|---|---|
| 1 | `/utama` | Tekan **Snap Resit** *(butang ink, 84px)* | Buka kamera peranti |
| 2 | Kamera | Ambil gambar resit | Mampat ke lebar 1400px, kualiti 0.82 |
| 3 | `/semak?status=baca` — skrin ink penuh, bar kemajuan bergerak, pratonton gambar | Tunggu *(sasaran ≤10s)* | Hantar ke `/api/baca-resit` → Claude API |
| 4 | `/semak` — nama kedai, no. invois, tarikh, jumlah, cara bayar, senarai item | Semak. Betulkan apa yang silap | Kira jumlah item secara langsung |
| 5 | Item tanpa kategori berchip **garis putus** "Pilih kategori" | Tap chip → pilih kategori | Butang **Simpan** kekal nyahaktif selagi ada item tanpa kategori |
| 6 | Footer melekat: "Jumlah item · RM 113.70" | Tekan **Simpan** | Muat naik gambar ke Storage, tulis `resit` + `item`, jana `ref` |
| 7 | `/utama` — jumlah bulan ini dikemas kini, resit muncul dalam "Terkini" | — | Selesai |

**Jalan alternatif — muat naik dari album:** langkah 1 tekan **Muat Naik dari Album**, pilih fail. Langkah 2 dilangkau. Selebihnya sama. `sumber = 'album'`.

**Jalan gagal — bacaan gagal:**

| Sebab | Mesej | Jalan keluar |
|---|---|---|
| Gambar gelap | "Gambar terlalu gelap untuk dibaca. Cuba snap semula di tempat terang." | **Cuba semula** \| **Masuk manual** |
| Bukan resit | "Ini nampak bukan resit. Cuba gambar yang lain." | **Cuba semula** \| **Masuk manual** |
| Tiada internet | "Sambungan terputus. Cuba lagi bila ada talian." | **Cuba semula** |
| Terlalu lama | "Pembacaan mengambil masa terlalu lama. Cuba semula, atau masuk manual." | **Cuba semula** \| **Masuk manual** |

Butang **Masuk manual** membawa ke `/manual` dengan gambar dibuang. Pengguna tidak boleh tersekat.

**Jalan alternatif — pengguna tekan kembali pada `/semak`:** papar dialog *"Rekod belum disimpan. Buang?"* dengan pilihan **Buang** dan **Teruskan semak**.

---

## Aliran C — Masuk manual

**Matlamat:** rekod belanja tunai tanpa resit dalam ≤15 saat.

| Langkah | Pengguna nampak | Pengguna buat | Sistem buat |
|---|---|---|---|
| 1 | `/utama` | Tekan **Masuk Manual** | → `/manual` |
| 2 | `/manual` — chip garis "Tiada bukti", medan jumlah besar (RM, 52px) | Taip jumlah | Kursor blok, garis bawah maroon |
| 3 | Medan "Untuk apa" | Taip penerangan ringkas | |
| 4 | Grid 12 chip kategori | Tap satu kategori | Chip terpilih jadi isi maroon |
| 5 | Medan Tarikh *(lalai hari ini)* | Ubah jika perlu | |
| 6 | Nota: rekod ini ditanda "tiada bukti" kerana tiada gambar | Tekan **Simpan** | Tulis `resit` dengan `sumber='manual'`, `tiada_bukti=true`, satu `item` |
| 7 | `/utama` dikemas kini | — | Selesai |

**Peraturan:** butang Simpan nyahaktif selagi jumlah kosong atau ≤0, atau kategori belum dipilih.

---

## Aliran D — Cari rekod lama

**Matlamat:** jumpa satu resit tertentu dan lihat gambar asalnya.

| Langkah | Pengguna nampak | Pengguna buat |
|---|---|---|
| 1 | Tab **Rekod** → `/rekod` | — |
| 2 | Medan carian, senarai dikumpul ikut bulan dengan jumlah setiap bulan | Tatal, atau taip nama kedai |
| 3 | Baris rekod: kedai, chip kategori "+n", jumlah, tarikh | Tap satu baris |
| 4 | `/rekod/[id]` — rujukan `#RL-000142 / INVOIS INV-8823419`, nama kedai, grid meta 2×2, senarai item, jumlah, blok gambar | Tekan **Buka penuh** untuk gambar |
| 5 | Gambar resit penuh skrin | Tutup |

**Padam resit:** ikon `trash` maroon pada header `/rekod/[id]` → dialog pengesahan → padam resit, item dan gambar → kembali ke `/rekod`.

---

## Aliran E — Tengok belanja bulanan

**Matlamat:** faham duit habis ke mana.

| Langkah | Pengguna nampak | Pengguna buat |
|---|---|---|
| 1 | Tab **Ringkasan** → `/ringkasan` | — |
| 2 | Segmented control **Bulanan / Tahunan** *(Tahunan berikon kunci untuk Basic)* | Kekal Bulanan |
| 3 | Blok poster maroon: bulan, jumlah 34px, perbandingan bulan lepas | — |
| 4 | Baris masuk "Dashboard AI Insight ›" *(latar maroon tint)* | — |
| 5 | Senarai kategori dengan bar mendatar 8px, disusun besar ke kecil | Baca |
| 6 | Kad upsell Premium, penafian cukai | — |

**Jalan Premium:** tekan **Tahunan** → jika Basic, papar paywall. Jika Premium, tukar paparan ke jumlah setahun ikut kategori.

**Penafian wajib:** *"ResitLog memaparkan jumlah belanja sahaja. Ia tidak mengira had pelepasan cukai dan bukan nasihat cukai. Sila rujuk LHDN atau ejen cukai anda."*

---

## Aliran F — Dashboard AI Insight

**Matlamat:** pengguna faham corak belanja mereka.

**Jika Premium, atau Basic dalam tempoh 30 hari:**

| Langkah | Pengguna nampak |
|---|---|
| 1 | `/ringkasan` → tekan **Dashboard AI Insight** |
| 2 | Header + chip PREMIUM. Jika Basic: bar percubaan maroon tint "12 hari lagi" + pautan Naik Premium |
| 3 | Blok purata 6 bulan: angka 32px + delta maroon, carta bar 6 bulan *(bulan semasa maroon, lain `#cbc9c8`)* |
| 4 | Tiga kad insight — sempadan kiri 3px maroon, tajuk + penjelasan 1-2 baris |
| 5 | Senarai perubahan kategori: naik `+%` maroon, turun `−%` kelabu |
| 6 | Penafian |

**Aksi:** tap kad insight → `/rekod` ditapis kepada rekod berkaitan. Tap bar carta → bulan itu.

**Jika Basic dan percubaan sudah tamat:**

| Langkah | Pengguna nampak |
|---|---|
| 1 | Header dengan ikon `lock` |
| 2 | Kandungan dashboard di belakang, **kabur** *(blur 1.5px, opacity 0.28)* |
| 3 | Kad Premium bersempadan maroon: kicker "Percubaan 30 hari tamat", tajuk, empat baris faedah |
| 4 | Butang **Naik Premium — RM9/bulan** |
| 5 | Nota jelas: **snap dan simpan resit kekal bebas pada Basic** |

Nota terakhir itu wajib. Tanpanya pengguna sangka seluruh app terkunci dan berhenti guna.

---

## Aliran G — Urus tetapan

| Seksyen | Isi | Aksi |
|---|---|---|
| **Akaun** | Nama, tarikh mula, mod, baris Pakej | **Naik Premium** *(butang 38px)* |
| **Data** | Jumlah rekod · Eksport ke Excel 🔒 · Mod pasangan 🔒 | Eksport *(Premium)* · Hidupkan mod pasangan *(Premium)* |
| **Bantuan** | Soalan lazim, Hubungi kami | Buka halaman berkenaan |
| **Bahaya** | Kotak bersempadan maroon | **Padam semua data** |
| Footer | Versi app | — |

**Padam semua data:** dialog pengesahan → pengguna taip semula `PADAM` → butang aktif → padam semua resit, item dan gambar. Akaun kekal. Nyatakan dengan jelas bahawa tindakan ini tidak boleh dibatalkan.

---

## Aliran H — Naik taraf ke mod pasangan *(Premium)*

| Langkah | Pengguna buat | Sistem buat |
|---|---|---|
| 1 | `/tetapan` → **Hidupkan mod pasangan** | Semak pakej = premium |
| 2 | Beri nama isi rumah | Cipta baris `isi_rumah`, tetapkan `pemilik_id` |
| 3 | Jemput pasangan melalui emel | Hantar jemputan |
| 4 | Pasangan terima, daftar/log masuk | Tetapkan `isi_rumah_id`, `peranan = 'kedua'` |
| 5 | Kedua-dua akaun nampak medan **Pemilik** pada setiap item | — |

**Penting:** rekod lama **tidak** perlu ditag semula. Medan `pemilik` sudah wujud dengan nilai `bersama` sejak hari pertama.

---

## Aliran I — Pasang sebagai app

| Peranti | Langkah |
|---|---|
| **iPhone · Safari** | 1. Tekan ikon Kongsi · 2. Tatal, pilih "Add to Home Screen" · 3. Tekan "Add" |
| **Android · Chrome** | 1. Tekan **Tambah sekarang** · 2. Sahkan dalam dialog pelayar |

Chrome menggunakan `beforeinstallprompt`. Safari tiada API — paparkan arahan bergambar sahaja. Skrin ini memaparkan pratonton ikon shortcut (petak maroon 64px, "RL") supaya pengguna tahu apa yang akan muncul pada skrin utama mereka.
