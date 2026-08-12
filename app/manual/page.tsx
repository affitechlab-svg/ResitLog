"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Butang, Chip, Dialog } from "@/komponen/ui";
import { useDataResit } from "@/lib/konteks-data";
import { KATEGORI, type KodKategori } from "@/lib/kategori";

function tarikhHariIni(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function HalamanMasukManual() {
  const router = useRouter();
  const { tambahResit } = useDataResit();

  const [jumlah, setJumlah] = useState("");
  const [untukApa, setUntukApa] = useState("");
  const [kategori, setKategori] = useState<KodKategori | null>(null);
  const [tarikh, setTarikh] = useState(tarikhHariIni());
  const [dialogKeluarTerbuka, setDialogKeluarTerbuka] = useState(false);

  const nilaiJumlah = Number(jumlah);
  const bolehSimpan = jumlah.trim() !== "" && nilaiJumlah > 0 && kategori !== null;
  const adaIsian = jumlah.trim() !== "" || untukApa.trim() !== "";

  function cubaKeluar() {
    if (adaIsian) {
      setDialogKeluarTerbuka(true);
    } else {
      router.push("/utama");
    }
  }

  function simpan() {
    if (!bolehSimpan || !kategori) return;
    tambahResit({
      kedai: untukApa.trim() || "Belanja manual",
      noInvois: null,
      tarikh,
      caraBayar: "tunai",
      sumber: "manual",
      gambarLaluan: null,
      tiadaBukti: true,
      item: [
        {
          nama: untukApa.trim() || "Belanja manual",
          harga: nilaiJumlah,
          kategori,
          pemilik: "bersama",
          susunan: 0,
        },
      ],
    });
    router.push("/utama");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-ground">
      <div className="flex items-center gap-3 border-b-2 border-ink px-4 py-2">
        <button type="button" onClick={cubaKeluar} aria-label="Kembali">
          <ChevronLeft size={22} strokeWidth={2} />
        </button>
        <span className="flex-1 text-[17px] font-extrabold">Masuk Manual</span>
        <Chip varian="garis" className="px-[7px] py-[3px] text-[10px] font-extrabold uppercase tracking-wider border-2 border-maroon text-maroon">
          Tiada bukti
        </Chip>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-5">
        <div className="text-[11px] font-semibold uppercase tracking-wider">Jumlah</div>
        <div className="flex items-baseline gap-2.5 border-b-2 border-maroon py-3.5">
          <span className="text-[22px] font-semibold text-maroon">RM</span>
          <input
            inputMode="decimal"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            aria-label="Jumlah dalam Ringgit Malaysia"
            className="w-full bg-transparent text-[52px] font-extrabold leading-none tracking-tight text-ink placeholder:text-field-border focus:outline-none"
          />
        </div>

        <label className="mt-5 flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Untuk apa</span>
          <input
            value={untukApa}
            onChange={(e) => setUntukApa(e.target.value)}
            placeholder="cth. Teh tarik + roti canai"
            className="h-[50px] border-2 border-ink bg-white px-3 text-base font-semibold text-ink"
          />
        </label>

        <div className="mb-2.5 mt-5 text-[11px] font-semibold uppercase tracking-wider">Kategori</div>
        <div className="flex flex-wrap gap-2">
          {KATEGORI.map((k) => (
            <Chip
              key={k.kod}
              varian={kategori === k.kod ? "isi" : "garis"}
              onClick={() => setKategori(k.kod)}
              className="text-[13px]"
            >
              {k.nama}
            </Chip>
          ))}
        </div>

        <label className="mt-5 flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Tarikh</span>
          <input
            type="date"
            value={tarikh}
            onChange={(e) => setTarikh(e.target.value)}
            className="h-[50px] border-2 border-ink bg-white px-3 text-base font-semibold text-ink"
          />
        </label>

        <div className="mt-4 border-t border-hairline pt-3.5 text-[13px] leading-relaxed text-muted">
          Rekod ini ditanda <strong className="text-maroon">tiada bukti</strong> kerana tiada gambar resit.
        </div>
      </div>

      <div className="border-t-2 border-ink px-5 py-4">
        <Butang varian="utama" onClick={simpan} disabled={!bolehSimpan}>
          Simpan
        </Butang>
      </div>

      <Dialog
        terbuka={dialogKeluarTerbuka}
        tajuk="Rekod belum disimpan. Keluar?"
        mesej="Isian yang anda taip akan hilang jika anda keluar sekarang."
        labelBatal="Teruskan isi"
        labelSahkan="Keluar"
        onBatal={() => setDialogKeluarTerbuka(false)}
        onSahkan={() => router.push("/utama")}
      />
    </div>
  );
}
