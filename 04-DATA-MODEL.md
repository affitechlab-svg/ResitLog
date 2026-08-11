# 04 — Data Model / Schema · ResitLog v1

Pangkalan data: **Supabase (Postgres)**. Semua nama jadual dan medan dalam Bahasa Melayu.

---

## 1. Gambaran hubungan

```
auth.users (Supabase)
     │ 1
     │
     ▼ 1
  pengguna ──────────┐
     │ 1             │ n
     │               ▼
     │ n         isi_rumah   (mod pasangan sahaja)
     ▼
   resit
     │ 1
     │ n
     ▼
   item ──────► kategori (rujukan tetap, bukan jadual pengguna)
```

**Prinsip:**
- Satu resit ada banyak item.
- Kategori diletak pada **item**, bukan pada resit. Satu resit boleh ada pelbagai kategori.
- `isi_rumah` hanya digunakan dalam mod pasangan, tetapi lajurnya wujud dari hari pertama.

---

## 2. Jadual `pengguna`

Profil tambahan bagi `auth.users`.

| Medan | Jenis | Wajib | Lalai | Nota |
|---|---|---|---|---|
| `id` | `uuid` | ✓ | — | PK, sama dengan `auth.users.id` |
| `nama` | `text` | ✓ | — | |
| `emel` | `text` | ✓ | — | Unik |
| `pakej` | `text` | ✓ | `'basic'` | `basic` \| `premium` |
| `mod` | `text` | ✓ | `'solo'` | `solo` \| `pasangan` |
| `isi_rumah_id` | `uuid` | ✗ | `null` | FK → `isi_rumah.id`, mod pasangan sahaja |
| `peranan` | `text` | ✓ | `'utama'` | `utama` \| `kedua` |
| `tarikh_mula` | `date` | ✓ | `now()` | Untuk kira percubaan 30 hari |
| `dashboard_habis_pada` | `date` | ✓ | `tarikh_mula + 30` | Tamat percubaan dashboard |
| `pasang_ditunjuk` | `boolean` | ✓ | `false` | Skrin `/pasang` sudah dipapar |
| `dicipta_pada` | `timestamptz` | ✓ | `now()` | |

---

## 3. Jadual `isi_rumah`

Wadah untuk mod pasangan. Dicipta hanya bila pengguna Premium hidupkan mod pasangan.

| Medan | Jenis | Wajib | Lalai | Nota |
|---|---|---|---|---|
| `id` | `uuid` | ✓ | `gen_random_uuid()` | PK |
| `nama` | `text` | ✓ | — | cth: "Rumah Ahmad" |
| `pemilik_id` | `uuid` | ✓ | — | FK → `pengguna.id`, akaun utama |
| `dicipta_pada` | `timestamptz` | ✓ | `now()` | |

---

## 4. Jadual `resit`

| Medan | Jenis | Wajib | Lalai | Nota |
|---|---|---|---|---|
| `id` | `uuid` | ✓ | `gen_random_uuid()` | PK |
| `ref` | `text` | ✓ | dijana | Format `RL-000142`, unik per pengguna |
| `pengguna_id` | `uuid` | ✓ | — | FK → `pengguna.id` |
| `isi_rumah_id` | `uuid` | ✗ | `null` | FK → `isi_rumah.id` |
| `kedai` | `text` | ✓ | — | Nama kedai |
| `no_invois` | `text` | ✗ | `null` | Dari resit, jika ada |
| `tarikh` | `date` | ✓ | — | Tarikh belanja, bukan tarikh rekod |
| `cara_bayar` | `text` | ✓ | `'tunai'` | `tunai` \| `kad` \| `ewallet` |
| `jumlah` | `numeric(10,2)` | ✓ | — | Mesti sama dengan jumlah item |
| `sumber` | `text` | ✓ | — | `gambar` \| `album` \| `manual` |
| `gambar_laluan` | `text` | ✗ | `null` | Laluan dalam Storage, bukan URL penuh |
| `tiada_bukti` | `boolean` | ✓ | `false` | `true` untuk rekod manual |
| `dicipta_pada` | `timestamptz` | ✓ | `now()` | |
| `dikemas_pada` | `timestamptz` | ✓ | `now()` | |

**Indeks:**
- `(pengguna_id, tarikh DESC)` — untuk senarai Rekod ikut bulan
- `(pengguna_id, kedai)` — untuk carian nama kedai
- `(pengguna_id, ref)` unik

**Nota `ref`:** dijana berturutan per pengguna, bermula `RL-000001`. Dipaparkan pada skrin Butiran Resit.

**Nota `gambar_laluan`:** simpan laluan sahaja (`{user_id}/{resit_id}.jpg`). URL bertandatangan dijana semasa dipapar, tempoh sah 1 jam. Jangan simpan URL penuh — ia tamat tempoh.

---

## 5. Jadual `item`

| Medan | Jenis | Wajib | Lalai | Nota |
|---|---|---|---|---|
| `id` | `uuid` | ✓ | `gen_random_uuid()` | PK |
| `resit_id` | `uuid` | ✓ | — | FK → `resit.id`, **ON DELETE CASCADE** |
| `nama` | `text` | ✓ | — | Nama item |
| `harga` | `numeric(10,2)` | ✓ | — | Jumlah baris selepas tolak promo |
| `kategori` | `text` | ✓ | — | Salah satu daripada 12 kod tetap |
| `pemilik` | `text` | ✓ | `'bersama'` | `saya` \| `pasangan` \| `bersama` |
| `susunan` | `integer` | ✓ | `0` | Kekalkan turutan seperti pada resit |

**Indeks:**
- `(resit_id)`
- `(kategori)` — untuk ringkasan

**Kekangan:** `kategori` mesti salah satu daripada 12 kod. Kuatkuasa dengan `CHECK` constraint atau enum. Pengguna **tidak boleh** cipta kategori baru.

**Peraturan penting:** `pemilik` **sentiasa** ditulis walaupun dalam mod solo (nilai `bersama`). Ini supaya naik taraf ke mod pasangan tidak memerlukan tag semula rekod lama.

---

## 6. Katalog kategori *(pemalar dalam kod, bukan jadual)*

```ts
// lib/kategori.ts
export const KATEGORI = [
  { kod: 'makanan',     nama: 'Makanan' },
  { kod: 'minuman',     nama: 'Minuman' },
  { kod: 'dapur',       nama: 'Barang dapur' },
  { kod: 'bayi',        nama: 'Pampers & bayi' },
  { kod: 'pakaian',     nama: 'Pakaian' },
  { kod: 'perubatan',   nama: 'Perubatan' },
  { kod: 'elektronik',  nama: 'Elektronik' },
  { kod: 'pendidikan',  nama: 'Pendidikan' },
  { kod: 'pengangkutan',nama: 'Pengangkutan' },
  { kod: 'utiliti',     nama: 'Utiliti' },
  { kod: 'gayahidup',   nama: 'Gaya hidup' },
  { kod: 'lain',        nama: 'Lain-lain' },
] as const;
```

Disimpan sebagai pemalar kod, **bukan** jadual pangkalan data, kerana senarai ini tetap dan pengguna tidak boleh ubah. Menjadikannya jadual hanya menjemput orang mengeditnya.

---

## 7. Row Level Security

**Wajib pada setiap jadual.** RLS dihidupkan sebelum sebarang data dimasukkan.

### `pengguna`
```sql
-- baca & kemas kini profil sendiri sahaja
using (id = auth.uid())
```

### `resit`
```sql
-- mod solo: rekod sendiri
-- mod pasangan: rekod dalam isi rumah yang sama
using (
  pengguna_id = auth.uid()
  OR (
    isi_rumah_id IS NOT NULL
    AND isi_rumah_id = (SELECT isi_rumah_id FROM pengguna WHERE id = auth.uid())
  )
)
```

### `item`
```sql
-- ikut kebenaran resit induknya
using (
  EXISTS (SELECT 1 FROM resit r WHERE r.id = item.resit_id AND <polisi resit>)
)
```

### `isi_rumah`
```sql
using (id = (SELECT isi_rumah_id FROM pengguna WHERE id = auth.uid()))
```

### Storage bucket `resit-gambar`
- Bucket **peribadi**.
- Polisi: pengguna hanya boleh muat naik dan baca fail dalam folder `{auth.uid()}/`.
- Akses melalui signed URL, tempoh sah 1 jam.

---

## 8. Seed data *(untuk pembangunan sahaja)*

Angka ini diambil dari papan reka bentuk supaya UI yang dibina boleh dibanding terus dengan rujukan.

### Pengguna ujian
```
nama: Ahmad Faizal
emel: ujian@resitlog.my
pakej: basic
mod: solo
tarikh_mula: 2026-07-20
dashboard_habis_pada: 2026-08-19   (12 hari lagi pada 7 Ogos)
```

### Resit 1 — Mydin *(sepadan dengan skrin Semak dan Butiran)*
```
ref: RL-000142
kedai: Mydin Subang Jaya
no_invois: INV-8823419
tarikh: 2026-08-11
cara_bayar: kad
jumlah: 113.70
sumber: album
tiada_bukti: false

item:
  1. Beras Jasmine 5kg   42.90   dapur
  2. Pampers M 62s       58.00   bayi
  3. Panadol 20s         12.80   perubatan
                        ------
                        113.70   ← mesti padan
```

### Resit 2 — Klinik
```
ref: RL-000141 · Klinik Amanah · 2026-08-10 · tunai · 85.00 · gambar
item: Konsultasi 45.00 perubatan · Ubat batuk 40.00 perubatan
```

### Resit 3 — manual, tiada bukti
```
ref: RL-000140 · Teh tarik + roti canai · 2026-08-10 · tunai · 7.40 · manual · tiada_bukti: true
item: Teh tarik + roti canai 7.40 makanan
```

### Resit 4 — petrol
```
ref: RL-000139 · Shell Kesas · 2026-08-08 · kad · 90.00 · gambar
item: Petrol 90.00 pengangkutan
```

### Resit 5 — farmasi
```
ref: RL-000138 · Watsons IOI Mall · 2026-08-06 · kad · 64.30 · gambar
item: Vitamin C 38.50 perubatan · Ubat gigi 25.80 perubatan
```

### Resit 6 — bulan lepas *(untuk uji pengumpulan ikut bulan)*
```
ref: RL-000120 · Tenaga Nasional · 2026-07-28 · ewallet · 132.60 · manual · tiada_bukti: true
item: Bil elektrik Julai 132.60 utiliti
```

**Sasaran jumlah paparan:**
- Ogos 2026: RM 1,284.50 *(tambah resit lain untuk cukupkan)*
- Julai 2026: RM 1,610.05

---

## 9. Pengiraan *(bukan disimpan, dikira semasa dipapar)*

| Pengiraan | Cara |
|---|---|
| Jumlah bulan ini | `SUM(resit.jumlah)` di mana `tarikh` dalam bulan semasa |
| Ringkasan ikut kategori | `SUM(item.harga) GROUP BY item.kategori` |
| Bilangan kategori aktif | `COUNT(DISTINCT item.kategori)` bulan itu |
| Baki hari percubaan | `dashboard_habis_pada - today` |
| Perbandingan bulan lepas | jumlah bulan ini − jumlah bulan lepas |
| Purata 6 bulan *(Dashboard)* | purata jumlah bulanan, 6 bulan terakhir |

**Jangan simpan nilai terkira dalam pangkalan data.** Ia akan jadi lapuk bila rekod diedit atau dipadam.

---

## 10. Peraturan integriti

1. **Padam resit** → semua itemnya dipadam automatik (`ON DELETE CASCADE`), dan gambarnya dipadam dari Storage.
2. **`resit.jumlah` mesti sama dengan `SUM(item.harga)`.** Kuatkuasa pada peringkat aplikasi sebelum simpan.
3. **Setiap item mesti ada kategori.** Tiada nilai `null` dibenarkan.
4. **Rekod manual** sentiasa `sumber = 'manual'`, `tiada_bukti = true`, `gambar_laluan = null`.
5. **Rekod bergambar** sentiasa `tiada_bukti = false` dan mesti ada `gambar_laluan`.
6. **Padam semua data** → padam semua resit, item dan gambar milik pengguna. Akaun kekal.
