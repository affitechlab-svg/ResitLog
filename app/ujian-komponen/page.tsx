"use client";

// Halaman ujian dalaman sahaja — bukan sebahagian daripada 14 skrin dalam
// 03-SITEMAP-ROUTING.md. Tujuan: banding komponen komponen/ui/ sebelah-menyebelah
// dengan ResitLog_UI_dc.html ikut checklist Fasa 1 dalam 09-BUILD-PHASES.md.

import { useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import {
  Butang,
  Medan,
  Chip,
  SegmentedControl,
  TabBar,
  Dialog,
  BlokPoster,
  KeadaanKosong,
} from "@/komponen/ui";
import { KATEGORI } from "@/lib/kategori";
import { formatRM } from "@/lib/format";

function Seksyen({ tajuk, children }: { tajuk: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-b-2 border-ink px-5 py-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-maroon">{tajuk}</h2>
      {children}
    </section>
  );
}

export default function HalamanUjianKomponen() {
  const [caraBayar, setCaraBayar] = useState("kad");
  const [modRingkasan, setModRingkasan] = useState("bulanan");
  const [kategoriDipilih, setKategoriDipilih] = useState<string | null>("dapur");
  const [dialogBiasaTerbuka, setDialogBiasaTerbuka] = useState(false);
  const [dialogPadamTerbuka, setDialogPadamTerbuka] = useState(false);

  return (
    <main className="mx-auto max-w-[480px] bg-ground pb-24">
      <div className="border-b-2 border-ink px-5 py-6">
        <h1 className="text-2xl font-extrabold text-ink">Ujian Komponen</h1>
        <p className="mt-1 text-sm text-muted">Fasa 1 — banding dengan ResitLog_UI_dc.html</p>
      </div>

      <Seksyen tajuk="Butang">
        <Butang varian="utama">Simpan</Butang>
        <Butang varian="ink" tinggi={84} ikon={<Camera size={28} strokeWidth={2} />}>
          <span className="block font-extrabold">Snap Resit</span>
          <span className="mt-1 block text-xs font-normal opacity-75">Kamera terbuka terus</span>
        </Butang>
        <Butang varian="garis" tinggi={64}>
          Muat Naik dari Album
        </Butang>
        <Butang varian="utama" disabled>
          Nyahaktif
        </Butang>
      </Seksyen>

      <Seksyen tajuk="Medan">
        <Medan label="Nama kedai" defaultValue="Mydin Subang Jaya" />
        <Medan label="Jumlah" tegas defaultValue="RM 113.70" />
        <Medan label="Emel" ralat="Emel ini sudah didaftarkan. Cuba log masuk." defaultValue="ujian@resitlog.my" />
      </Seksyen>

      <Seksyen tajuk="Chip">
        <div className="flex flex-wrap gap-2">
          <Chip varian="isi">Makanan</Chip>
          <Chip varian="tint">Barang dapur ▾</Chip>
          <Chip varian="garis">Minuman</Chip>
          <Chip varian="garis-putus">Pilih kategori ▾</Chip>
          <Chip varian="garis" className="px-[7px] py-[3px] text-[10px] font-extrabold uppercase tracking-wider">
            Tiada bukti
          </Chip>
        </div>
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider">
            Grid kategori (interaktif)
          </div>
          <div className="flex flex-wrap gap-2">
            {KATEGORI.map((k) => (
              <Chip
                key={k.kod}
                varian={kategoriDipilih === k.kod ? "isi" : "garis"}
                onClick={() => setKategoriDipilih(k.kod)}
              >
                {k.nama}
              </Chip>
            ))}
          </div>
        </div>
      </Seksyen>

      <Seksyen tajuk="SegmentedControl">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider">Cara bayar</div>
          <SegmentedControl
            warnaAktif="maroon"
            nilaiTerpilih={caraBayar}
            onUbah={setCaraBayar}
            opsyen={[
              { nilai: "tunai", label: "Tunai" },
              { nilai: "kad", label: "Kad" },
              { nilai: "ewallet", label: "E-wallet" },
            ]}
          />
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider">Ringkasan</div>
          <SegmentedControl
            warnaAktif="ink"
            nilaiTerpilih={modRingkasan}
            onUbah={setModRingkasan}
            opsyen={[
              { nilai: "bulanan", label: "Bulanan" },
              { nilai: "tahunan", label: "Tahunan", dikunci: true },
            ]}
          />
        </div>
      </Seksyen>

      <Seksyen tajuk="BlokPoster">
        <BlokPoster
          besar
          label="Belanja bulan ini"
          nilai={formatRM(1284.5)}
          meta="Ogos 2026 · 42 resit · 6 kategori"
        />
        <BlokPoster
          label="Ogos 2026"
          nilai={formatRM(1284.5)}
          meta="42 resit · turun RM325.55 daripada Julai"
        />
      </Seksyen>

      <Seksyen tajuk="Dialog">
        <Butang varian="garis" onClick={() => setDialogBiasaTerbuka(true)}>
          Buka dialog pengesahan biasa
        </Butang>
        <Butang
          varian="garis"
          ikon={<Trash2 size={18} strokeWidth={2} />}
          onClick={() => setDialogPadamTerbuka(true)}
        >
          Buka dialog Padam (taip ulang)
        </Butang>
        <Dialog
          terbuka={dialogBiasaTerbuka}
          tajuk="Rekod belum disimpan. Buang?"
          mesej="Semua yang anda semak akan hilang jika anda keluar sekarang."
          labelBatal="Teruskan semak"
          labelSahkan="Buang"
          onBatal={() => setDialogBiasaTerbuka(false)}
          onSahkan={() => setDialogBiasaTerbuka(false)}
        />
        <Dialog
          terbuka={dialogPadamTerbuka}
          tajuk="Padam semua data"
          mesej="Semua resit, item dan gambar akan hilang terus. Tindakan ini tidak boleh dibatalkan."
          labelSahkan="Padam"
          taipUlangTeks="PADAM"
          onBatal={() => setDialogPadamTerbuka(false)}
          onSahkan={() => setDialogPadamTerbuka(false)}
        />
      </Seksyen>

      <Seksyen tajuk="KeadaanKosong">
        <div className="border border-hairline">
          <KeadaanKosong
            tajuk="Belum ada rekod"
            mesej="Snap resit pertama anda atau masuk manual untuk mula rekod belanja."
            aksi={
              <Butang varian="utama" lebarPenuh={false}>
                Snap Resit
              </Butang>
            }
          />
        </div>
      </Seksyen>

      <Seksyen tajuk="TabBar">
        <div className="border-2 border-ink">
          <TabBar />
        </div>
      </Seksyen>
    </main>
  );
}
