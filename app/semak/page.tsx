"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Butang, Dialog, SegmentedControl } from "@/komponen/ui";
import SenaraiItem from "@/komponen/resit/SenaraiItem";
import { useBacaan } from "@/lib/konteks-bacaan";
import { useDataResit } from "@/lib/konteks-data";
import { formatRM } from "@/lib/format";
import type { CaraBayar } from "@/jenis";
import type { KodKategori } from "@/lib/kategori";

const LANGKAH_BACAAN = ["Membaca kedai dan tarikh", "Membaca item", "Menyemak jumlah"];
const TEMPOH_BACAAN_MS = 2600;

export default function HalamanSemak() {
  const router = useRouter();
  const { status, keputusan, tandaSedia, kemaskiniKeputusan, ubahKategoriItem, batal } = useBacaan();
  const { tambahResit } = useDataResit();
  const [progres, setProgres] = useState(0);
  const [dialogKeluarTerbuka, setDialogKeluarTerbuka] = useState(false);
  const [gambarPenuhTerbuka, setGambarPenuhTerbuka] = useState(false);

  // Tiada gambar dalam sesi -> kembali ke Utama (03-SITEMAP-ROUTING.md §4).
  useEffect(() => {
    if (status === "kosong") router.replace("/utama");
  }, [status, router]);

  useEffect(() => {
    if (status !== "membaca") return;
    const mula = Date.now();
    setProgres(0);
    const selang = setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - mula) / TEMPOH_BACAAN_MS) * 100));
      setProgres(p);
      if (p >= 100) {
        clearInterval(selang);
        tandaSedia();
      }
    }, 120);
    return () => clearInterval(selang);
  }, [status, tandaSedia]);

  if (status === "kosong" || !keputusan) return null;

  if (status === "membaca") {
    const langkah = progres < 40 ? 0 : progres < 80 ? 1 : 2;
    return (
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-ink text-ground">
        <div className="flex flex-1 flex-col px-6 py-8">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-maroon-tint">
            Langkah {langkah + 1} daripada 3
          </div>
          <h2 className="mt-3.5 text-[34px] font-extrabold leading-tight tracking-tight">
            Sedang baca
            <br />
            resit anda
          </h2>
          <div className="mt-3 text-[15px] text-hairline">Biasanya siap dalam 6 saat.</div>

          <div className="mt-7 h-1.5 bg-[#3a3736]">
            <div className="h-1.5 bg-maroon transition-[width]" style={{ width: `${progres}%` }} />
          </div>
          <div className="mt-2.5 flex justify-between text-xs text-hairline">
            <span>{LANGKAH_BACAAN[langkah]}</span>
            <span>{progres}%</span>
          </div>

          {keputusan.gambarUrl && (
            <div className="mt-8 border-2 border-[#4a4746] p-3.5">
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-hairline">
                {keputusan.sumber === "album" ? "Gambar dari album" : "Gambar dari kamera"}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element -- object URL sementara, bukan aset dioptimumkan */}
              <img
                src={keputusan.gambarUrl}
                alt={`Pratonton resit sedang dibaca: ${keputusan.namaFail}`}
                className="h-[300px] w-full object-cover"
              />
            </div>
          )}

          <div className="flex-1" />

          <div className="border-t-2 border-[#4a4746] pt-4">
            <div className="text-[13px] text-hairline">
              Gambar gelap atau lusuh? Anda boleh cuba semula, atau masuk butiran secara manual.
            </div>
            <div className="mt-3 flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  batal();
                  router.push("/utama");
                }}
                className="h-12 flex-1 border-2 border-[#6d6a68] px-4 text-left text-sm font-semibold text-ground hover:bg-white/[0.07] active:bg-white/[0.14]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  batal();
                  router.push("/manual");
                }}
                className="h-12 flex-1 border-2 border-maroon px-4 text-left text-sm font-semibold text-maroon-tint hover:bg-white/[0.07] active:bg-white/[0.14]"
              >
                Masuk manual
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const jumlahItem = keputusan.item.reduce((jum, i) => jum + i.harga, 0);
  const beza = jumlahItem - keputusan.jumlahResit;
  const semuaAdaKategori = keputusan.item.every((i) => i.kategori !== null);

  function simpan() {
    if (!semuaAdaKategori || !keputusan) return;
    tambahResit({
      kedai: keputusan.kedai,
      noInvois: keputusan.noInvois || null,
      tarikh: keputusan.tarikh,
      caraBayar: keputusan.caraBayar,
      sumber: keputusan.sumber,
      gambarLaluan: null,
      tiadaBukti: false,
      item: keputusan.item.map((i, indeks) => ({
        nama: i.nama,
        harga: i.harga,
        kategori: i.kategori as KodKategori,
        pemilik: "bersama",
        susunan: indeks,
      })),
    });
    batal();
    router.push("/utama");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-ground">
      <div className="flex items-center gap-3 border-b-2 border-ink px-4 py-2">
        <button type="button" onClick={() => setDialogKeluarTerbuka(true)} aria-label="Kembali">
          <ChevronLeft size={22} strokeWidth={2} />
        </button>
        <span className="flex-1 text-[17px] font-extrabold">Semak Resit</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-maroon">Dibaca sistem</span>
      </div>

      <div className="flex-1 px-5 pt-4">
        <div className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Nama kedai</span>
            <input
              value={keputusan.kedai}
              onChange={(e) => kemaskiniKeputusan({ kedai: e.target.value })}
              className="h-[46px] border-2 border-ink bg-white px-3 text-base font-semibold text-ink"
            />
          </label>

          <div className="flex gap-2.5">
            <label className="flex flex-[1.15] flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider">No. invois</span>
              <input
                value={keputusan.noInvois ?? ""}
                onChange={(e) => kemaskiniKeputusan({ noInvois: e.target.value })}
                className="h-[46px] w-full border-2 border-ink bg-white px-2.5 text-sm font-semibold text-ink"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Tarikh</span>
              <input
                type="date"
                value={keputusan.tarikh}
                onChange={(e) => kemaskiniKeputusan({ tarikh: e.target.value })}
                className="h-[46px] w-full border-2 border-ink bg-white px-2 text-sm font-semibold text-ink"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Jumlah</span>
              <input
                inputMode="decimal"
                value={keputusan.jumlahResit}
                onChange={(e) =>
                  kemaskiniKeputusan({ jumlahResit: Number(e.target.value.replace(/[^0-9.]/g, "")) || 0 })
                }
                className="h-[46px] w-full border-2 border-maroon bg-white px-2 text-sm font-extrabold text-maroon"
              />
            </label>
          </div>

          <div>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider">Cara bayar</div>
            <SegmentedControl
              warnaAktif="maroon"
              nilaiTerpilih={keputusan.caraBayar}
              onUbah={(n) => kemaskiniKeputusan({ caraBayar: n as CaraBayar })}
              opsyen={[
                { nilai: "tunai", label: "Tunai" },
                { nilai: "kad", label: "Kad" },
                { nilai: "ewallet", label: "E-wallet" },
              ]}
            />
          </div>
        </div>

        <div className="mt-5 flex items-baseline justify-between border-t-2 border-ink pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Item · pilih kategori</span>
          <span className="text-xs text-muted">{keputusan.item.length} dibaca</span>
        </div>
        <SenaraiItem item={keputusan.item} onUbahKategori={ubahKategoriItem} />

        {Math.abs(beza) > 0.005 && (
          <div className="mt-3 border-2 border-maroon bg-maroon-tint p-3 text-[13px] text-on-tint">
            Jumlah item ({formatRM(jumlahItem)}) {beza > 0 ? "melebihi" : "kurang daripada"} jumlah pada
            resit ({formatRM(keputusan.jumlahResit)}) sebanyak {formatRM(Math.abs(beza))}.
          </div>
        )}

        {keputusan.gambarUrl && (
          <button
            type="button"
            onClick={() => setGambarPenuhTerbuka(true)}
            className="mt-4 text-xs font-semibold text-maroon"
          >
            Lihat gambar
          </button>
        )}
      </div>

      <div className="border-t-2 border-ink px-5 py-3.5">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider">Jumlah item</span>
          <span className="text-[22px] font-extrabold">{formatRM(jumlahItem)}</span>
        </div>
        <Butang varian="utama" onClick={simpan} disabled={!semuaAdaKategori}>
          Simpan
        </Butang>
      </div>

      <Dialog
        terbuka={dialogKeluarTerbuka}
        tajuk="Rekod belum disimpan. Buang?"
        mesej="Semua yang anda semak akan hilang jika anda keluar sekarang."
        labelBatal="Teruskan semak"
        labelSahkan="Buang"
        onBatal={() => setDialogKeluarTerbuka(false)}
        onSahkan={() => {
          batal();
          router.push("/utama");
        }}
      />

      {gambarPenuhTerbuka && keputusan.gambarUrl && (
        <div
          role="presentation"
          onClick={() => setGambarPenuhTerbuka(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- object URL sementara, bukan aset dioptimumkan */}
          <img src={keputusan.gambarUrl} alt="Gambar resit penuh skrin" className="max-h-full max-w-full" />
        </div>
      )}
    </div>
  );
}
