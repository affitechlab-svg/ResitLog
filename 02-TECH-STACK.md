# 02 — Tech Stack · ResitLog v1

---

## 1. Ringkasan

| Lapisan | Pilihan | Sebab |
|---|---|---|
| Rangka kerja | **Next.js 15 (App Router)** | Server Components, route handler untuk sembunyikan kunci API, PWA mudah |
| Bahasa | **TypeScript** (`strict: true`) | Skema data ketat, kurang bug |
| Gaya | **Tailwind CSS** | Token custom, tiada pustaka UI yang melawan reka bentuk radius-0 |
| Pangkalan data | **Supabase (Postgres)** | Auth + DB + Storage dalam satu, RLS terbina |
| Auth | **Supabase Auth** | Emel/kata laluan + Google + Apple |
| Simpanan fail | **Supabase Storage** | Gambar resit, bucket peribadi |
| Bacaan resit | **Anthropic Claude API** melalui route handler | Baca resit Malaysia lebih baik daripada OCR biasa |
| Hosting | **Railway** | Membenarkan penggunaan komersial pada plan murah; domain custom `resitlog.my` |
| Ikon | **lucide-react** | Stroke 2px, sepadan dengan reka bentuk |
| Font | **Archivo** via `next/font/google` | Font tunggal projek |

**Jangan guna:** MUI, Chakra, Ant Design, Bootstrap, shadcn/ui — semuanya membawa radius dan bayang lalai yang melawan reka bentuk Modernist. Bina komponen sendiri.

---

## 2. Struktur folder

```
resitlog/
├─ app/
│  ├─ (auth)/
│  │  ├─ mula/page.tsx
│  │  ├─ daftar/page.tsx
│  │  └─ log-masuk/page.tsx
│  ├─ (app)/
│  │  ├─ layout.tsx              ← tab bar
│  │  ├─ utama/page.tsx
│  │  ├─ rekod/page.tsx
│  │  ├─ rekod/[id]/page.tsx
│  │  ├─ ringkasan/page.tsx
│  │  ├─ ringkasan/dashboard/page.tsx
│  │  └─ tetapan/page.tsx
│  ├─ semak/page.tsx
│  ├─ manual/page.tsx
│  ├─ pasang/page.tsx
│  ├─ api/
│  │  └─ baca-resit/route.ts     ← panggil Claude API di server
│  ├─ layout.tsx
│  ├─ globals.css
│  └─ manifest.ts
├─ komponen/
│  ├─ ui/                        ← Butang, Medan, Chip, Tab, Dialog
│  └─ resit/                     ← BarisResit, SenaraiItem, PemilihKategori
├─ lib/
│  ├─ supabase/                  ← klien pelayan & pelayar
│  ├─ kategori.ts                ← katalog tetap 12 kategori
│  ├─ gambar.ts                  ← mampat sebelum muat naik
│  └─ format.ts                  ← RM, tarikh, nama bulan BM
├─ jenis/
│  └─ index.ts                   ← taip Resit, Item, Pengguna
├─ public/
│  ├─ ikon-192.png
│  ├─ ikon-512.png
│  └─ sw.js
├─ DEV-LOG.md                    ← wajib, rujuk CLAUDE.md
└─ tailwind.config.ts
```

---

## 3. Konfigurasi Tailwind

Token reka bentuk mesti didaftar sebagai warna custom. Jangan guna palet Tailwind lalai.

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      ink:        '#201e1d',
      ground:     '#f6f5f4',
      surface:    '#eae9e9',
      maroon:     '#6e1428',
      'maroon-pressed': '#4a0d1b',
      'maroon-hover':   '#5d1122',
      'maroon-tint':    '#f0e4e7',
      'on-tint':  '#5c3a41',
      muted:      '#6d6a68',
      disabled:   '#8a8785',
      hairline:   '#d5d3d2',
      'field-border': '#cbc9c8',
    },
    fontFamily: { sans: ['var(--font-archivo)'] },
    borderRadius: { DEFAULT: '0', none: '0', sm: '0', md: '0', lg: '0', full: '0' },
    boxShadow: { DEFAULT: 'none', none: 'none' },
  }
}
```

Radius dan bayang **sengaja dimatikan pada peringkat konfigurasi** supaya tiada kelas Tailwind boleh memperkenalkannya secara tidak sengaja.

---

## 4. Pemboleh ubah persekitaran

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        ← server sahaja, jangan dedah
ANTHROPIC_API_KEY=                ← server sahaja, jangan dedah
NEXT_PUBLIC_APP_URL=https://resitlog.my
```

**Peraturan keras:** `ANTHROPIC_API_KEY` dan `SUPABASE_SERVICE_ROLE_KEY` **tidak boleh** muncul dalam kod klien atau sebarang pembolehubah berawalan `NEXT_PUBLIC_`.

---

## 5. Aliran bacaan resit

```
Pelayar                      Server                    Anthropic
   │                            │                          │
   ├─ mampat gambar ≤300KB      │                          │
   ├─ POST /api/baca-resit ────►│                          │
   │                            ├─ sahkan sesi pengguna    │
   │                            ├─ POST /v1/messages ─────►│
   │                            │◄──── JSON butiran resit ─┤
   │                            ├─ sahkan bentuk JSON      │
   │◄──── butiran resit ────────┤                          │
   ├─ papar skrin Semak         │                          │
   ├─ pengguna betulkan         │                          │
   ├─ Simpan ──────────────────►│ tulis ke Supabase        │
```

**Peraturan:**
- Gambar dimampat di pelayar **sebelum** dihantar (lebar maks 1400px, kualiti 0.82).
- Route handler mengesahkan sesi pengguna sebelum memanggil API. Tiada panggilan tanpa auth.
- Balasan model disahkan bentuknya sebelum dihantar ke klien. Jika tidak sah, pulangkan ralat yang boleh difahami pengguna.
- Gambar dimuat naik ke Storage **hanya selepas** pengguna tekan Simpan — bukan semasa bacaan. Ini elak sampah bila pengguna batal.

---

## 6. Supabase

**Auth:** emel+kata laluan, Google OAuth, Apple OAuth.

**Storage:** satu bucket `resit-gambar`, **peribadi**. Akses melalui signed URL sahaja, tempoh sah 1 jam. Laluan fail: `{user_id}/{resit_id}.jpg`.

**RLS:** wajib pada setiap jadual. Polisi asas — pengguna hanya boleh baca/tulis baris di mana `pengguna_id = auth.uid()`. Untuk mod pasangan, tambah semakan `isi_rumah_id`. Butiran dalam `04-DATA-MODEL.md`.

**Migrasi:** simpan sebagai fail SQL dalam `supabase/migrations/`. Jangan ubah skema melalui papan pemuka sahaja — perubahan mesti ada dalam repo.

---

## 7. PWA

```ts
// app/manifest.ts
{
  name: 'ResitLog',
  short_name: 'ResitLog',
  description: 'Simpan resit belanja harian',
  start_url: '/utama',
  display: 'standalone',
  background_color: '#f6f5f4',
  theme_color: '#6e1428',
  icons: [ /* 192px, 512px — petak maroon, huruf "RL" putih */ ]
}
```

- Service worker untuk cache shell app sahaja. **Bukan** untuk mod luar talian penuh — itu ditangguh.
- Skrin **Pasang** (12) dipaparkan sekali selepas log masuk pertama, dan boleh dibuka semula dari Tetapan.
- Chrome: guna `beforeinstallprompt`. Safari: tiada API — paparkan arahan bergambar.

---

## 8. Prestasi

| Perkara | Sasaran | Cara |
|---|---|---|
| Muat skrin Utama | ≤2s pada 4G | Server Components, kurangkan JS klien |
| Snap → Semak | ≤10s | Mampat gambar, bar kemajuan sebenar |
| Saiz gambar | ≤300KB | Canvas resize sebelum muat naik |
| Bundle JS awal | ≤150KB gzip | Tiada pustaka UI besar |

---

## 9. Penempatan

- **Railway**, sambung ke repo GitHub.
- Cawangan `main` → produksi (`resitlog.my`). Cawangan lain → URL pratonton automatik.
- Pemboleh ubah persekitaran ditetapkan dalam tab **Variables** projek Railway, bukan dalam repo.
- Railway mengesan Next.js sendiri — tiada fail konfigurasi khas diperlukan.
- SSL automatik melalui Let's Encrypt selepas domain custom disambung.
- Supabase: satu projek untuk pembangunan, satu untuk produksi. Jangan uji pada data sebenar.

**Kenapa Railway, bukan Vercel:** plan Hobby Vercel melarang penggunaan komersial, dan ResitLog mempunyai pakej Premium berbayar. Vercel Pro berharga USD 20/orang/bulan. Railway membenarkan penggunaan komersial bermula USD 5/bulan dengan kredit termasuk, dan mengecaj mengikut penggunaan sebenar.

**Kesan pada kod:** tiada. Next.js berjalan sama pada kedua-dua platform. Perbezaan hanya pada tempat pemboleh ubah persekitaran ditetapkan dan cara domain disambung.

**Nota migrasi:** repo ResitLog di GitHub kini bersambung ke Vercel. Putuskan sambungan itu (Vercel → Settings → Git → Disconnect) sebelum menyambung ke Railway, supaya tiada dua platform cuba deploy repo yang sama.
