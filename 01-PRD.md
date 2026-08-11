# 01 — PRD (Keperluan Produk) · ResitLog v1

---

## 1. Tujuan produk

**ResitLog** ialah aplikasi web mobile-first untuk menyimpan resit belanja harian. Pengguna snap gambar resit, sistem baca butirannya, pengguna semak dan simpan. Rekod tersusun ikut bulan dan kategori.

Satu ayat teras: **simpan resit dengan kemas, tanpa berfikir.**

Setiap keputusan produk tunduk pada ayat ini. Jika satu ciri tidak membantu pengguna merekod resit dengan lebih cepat, ia bukan untuk v1.

**Masalah yang diselesaikan:** resit hilang, lusuh atau tercampak. Bila pengguna perlukan rekod belanja — untuk rujukan cukai, atau sekadar nak tahu duit habis ke mana — semuanya sudah tersusun.

---

## 2. Pengguna sasaran

Sesiapa sahaja yang berbelanja dan mahu simpan resit. Tiada sasaran sempit.

Risiko pendekatan ini diakui: "untuk semua orang" boleh menjadi "tidak cukup baik untuk sesiapa". Pertahanannya — **teras app buat satu benda sahaja dengan sangat baik**: simpan resit. Ciri khusus (rujukan cukai, analisis) adalah lapisan tambahan di atas teras, bukan sebahagian daripadanya.

---

## 3. Skop v1 — apa YANG ADA

| # | Ciri | Nota |
|---|---|---|
| 1 | Daftar / log masuk akaun | Emel+kata laluan, Google, Apple |
| 2 | Snap resit guna kamera | Sistem baca kedai, tarikh, item, harga |
| 3 | Muat naik resit dari album | Aliran sama seperti snap |
| 4 | Skrin Semak sebelum simpan | Wajib. Tiada auto-simpan |
| 5 | Masuk manual | 4 medan: jumlah, untuk apa, kategori, tarikh |
| 6 | Kategori pada setiap item | 12 kategori tetap |
| 7 | Senarai rekod ikut bulan | Dengan carian nama kedai |
| 8 | Butiran resit + gambar asal | Boleh buka penuh |
| 9 | Ringkasan bulanan ikut kategori | Dengan bar mendatar |
| 10 | Ringkasan tahunan | **Premium** |
| 11 | Dashboard AI Insight | **Premium** + percubaan 30 hari untuk Basic |
| 12 | Eksport ke Excel | **Premium** |
| 13 | Mod pasangan | **Premium** |
| 14 | Tambah ke skrin utama (PWA) | Ganti kepada app store |
| 15 | Padam semua data | Dengan pengesahan taip semula |

---

## 4. Skop v1 — apa YANG TIADA

| Ciri | Sebab ditangguh |
|---|---|
| Kiraan had pelepasan LHDN | Peraturan berubah setiap tahun. Kalau salah, pengguna tanggung akibat. App tunjuk jumlah sahaja |
| Peringatan e-Invois | Perlu sistem notifikasi — kerja besar, faedah kecil di peringkat awal |
| Kategori automatik yang belajar sendiri | Perlu data banyak. Buat selepas ~1,000 resit sebenar |
| Sambungan terus ke Google Sheet | Setiap pengguna kena benarkan akses akaun Google. Ramai tersekat di situ. Eksport fail sudah memadai |
| Guna tanpa internet | Bunyi mudah, sebenarnya rumit. Tunggu ada pengguna mengadu |
| Belanjawan bulanan | App lain sudah buat ini. ResitLog jual "simpan resit", bukan "kawal duit" |
| Bahasa Inggeris | Siapkan BM dahulu, betulkan, baru tambah bahasa kedua |
| Cipta kategori sendiri | Membuat ringkasan jadi kacau — "Makan", "Makanan", "Food" jadi tiga kategori |
| Kongsi resit ke orang lain | Bukan teras |
| Imbas QR e-Invois | Tangguh bersama ciri e-Invois |

---

## 5. Pakej dan harga

### Basic *(percuma)*

| Boleh | Tidak boleh |
|---|---|
| Snap dan simpan resit **tanpa had** | Ringkasan tahunan |
| Muat naik dari album | Eksport data |
| Masuk manual | Mod pasangan |
| Kategori pada setiap item | Dashboard AI Insight *(selepas 30 hari)* |
| Rekod dan carian | |
| Ringkasan bulanan | |
| Buka gambar resit asal | |
| Dashboard AI Insight **30 hari pertama** | |

### Premium — RM9/bulan *(harga sementara, sahkan sebelum bina bahagian bayaran)*

Semua dalam Basic, tambah:
- Ringkasan **tahunan** ikut kategori — untuk rujukan cukai
- **Eksport** ke Excel
- **Mod pasangan** — dua akaun, tag pemilik setiap item
- **Dashboard AI Insight** tanpa had masa

### Prinsip pakej

1. **Basic mesti cukup berguna untuk diguna setiap hari selama setahun.** Kalau Basic terlalu lemah, pengguna berhenti sebelum sempat nampak nilai Premium.
2. **Tiada had bilangan resit pada Basic.** Pengguna yang snap 60 resit sebulan ialah pengguna terbaik — jangan halang mereka.
3. **Premium dijual pada Februari–April**, bila pengguna mula sibuk fikir cukai. Itulah masa mereka rasa berbaloi bayar.
4. Snap dan simpan **kekal bebas** pada Basic walaupun selepas percubaan dashboard tamat. Ini mesti dinyatakan dengan jelas pada skrin paywall.

---

## 6. Katalog kategori

Senarai **tetap**. Pengguna tidak boleh cipta, padam atau namakan semula.

| Kod | Nama papar | Contoh |
|---|---|---|
| `makanan` | Makanan | nasi, roti, buah, lauk |
| `minuman` | Minuman | air, kopi, teh tarik |
| `dapur` | Barang dapur | beras, minyak masak, telur, gula |
| `bayi` | Pampers & bayi | pampers, susu formula, tisu basah |
| `pakaian` | Pakaian | baju, kasut, tudung |
| `perubatan` | Perubatan | ubat, klinik, pergigian |
| `elektronik` | Elektronik | telefon, komputer, aksesori |
| `pendidikan` | Pendidikan | buku, yuran, alat tulis |
| `pengangkutan` | Pengangkutan | petrol, tol, parking, e-hailing |
| `utiliti` | Utiliti | elektrik, air, internet, telefon |
| `gayahidup` | Gaya hidup | gim, hiburan, langganan |
| `lain` | Lain-lain | apa yang tak masuk mana-mana |

**Nota untuk masa depan:** "Lain-lain" ialah ruang selamat. Selepas beberapa bulan, semak apa yang pengguna kerap letak di situ — itu petunjuk kategori baru yang patut ditambah pada v2.

---

## 7. Business rules

### BR-01 — Semak wajib
Setiap resit yang dibaca sistem **mesti** melalui skrin Semak. Tiada auto-simpan. Rekod hanya wujud selepas pengguna tekan Simpan.

### BR-02 — Kategori wajib
Butang Simpan pada skrin Semak **nyahaktif** selagi ada item tanpa kategori. Item begitu dipaparkan dengan chip garis putus maroon berlabel "Pilih kategori".

### BR-03 — Jumlah mesti padan
Jumlah item = hasil tambah semua harga baris. Jika berbeza daripada jumlah yang dibaca dari resit, tunjuk beza kepada pengguna. Jangan senyap betulkan.

### BR-04 — Tanda tiada bukti
Rekod yang dimasuk manual disimpan dengan `tiada_bukti = true`. Dipaparkan sebagai chip garis "Tiada bukti" dalam Rekod dan Butiran Resit. Rekod dari gambar sentiasa `tiada_bukti = false`.

### BR-05 — Tiada nasihat cukai
App hanya memaparkan **jumlah belanja ikut kategori**. App **tidak** mengira had pelepasan, **tidak** menuntut apa-apa, **tidak** memberi nasihat cukai. Penafian mesti dipaparkan pada skrin Ringkasan dan Dashboard.

### BR-06 — Pemilik sentiasa disimpan
Medan `pemilik` pada setiap item **sentiasa** ditulis (`bersama` sebagai lalai dalam mod solo), walaupun tidak dipaparkan. Ini supaya pengguna yang naik taraf ke mod pasangan tidak perlu tag semula rekod lama.

### BR-07 — Percubaan dashboard
Pengguna Basic dapat Dashboard AI Insight selama **30 hari** dari tarikh daftar. Bar percubaan memaparkan baki hari. Selepas tamat, skrin bertukar ke paparan terkunci (14).

### BR-08 — Padam semua data
Perlu dialog pengesahan **dan** pengguna taip semula perkataan `PADAM`. Tindakan tidak boleh dibatalkan; nyatakan ini dalam dialog.

### BR-09 — Kegagalan bacaan
Jika sistem gagal baca gambar, mesej ralat mesti nyatakan sebab yang mungkin **dan** beri dua jalan keluar: cuba semula, atau masuk manual.

### BR-10 — Satu resit banyak kategori
Satu resit boleh mengandungi item pelbagai kategori. Kategori diletak pada **item**, bukan pada resit. Senarai Rekod memaparkan sehingga 2 chip kategori diikuti "+n".

---

## 8. Metrik kejayaan v1

| Metrik | Sasaran |
|---|---|
| Masa snap → simpan | ≤ 10 saat |
| Pengguna masih aktif selepas 14 hari | ≥ 40% |
| Resit direkod per pengguna aktif sebulan | ≥ 15 |
| Kadar kegagalan bacaan resit | ≤ 15% |
| Penukaran Basic → Premium *(musim cukai)* | ≥ 5% |

---

## 9. Risiko

1. **Bacaan resit tidak sentiasa tepat.** Resit lusuh, gambar gelap, cetakan pudar akan gagal. Skrin Semak ialah pertahanan utama. Mesej gagal mesti berguna.

2. **Pengguna berhenti selepas minggu kedua.** Ini punca kematian nombor satu bagi app rekod belanja. Setiap saat tambahan pada aliran snap adalah risiko langsung.

3. **Gambar resit makan ruang simpanan.** Perlu dirancang lebih awal daripada yang disangka. Mampat setiap gambar ke ≤300KB sebelum disimpan.

4. **Sasaran "semua orang".** Dikawal dengan menjaga teras sempit — simpan resit sahaja.

---

## 10. Ujian sebelum lepas kepada orang lain

Pemilik projek guna sendiri selama **dua minggu penuh**, snap setiap resit sebenar termasuk yang kecil.

Ini bukan ujian sama ada app berfungsi. Ia menjawab satu soalan: **adakah saya sendiri sanggup buat setiap hari?**

Kalau jawapannya tidak selepas hari kelima, masalahnya bukan kekurangan ciri — masalahnya aliran snap terlalu lambat. Pendekkan, jangan tambah.
