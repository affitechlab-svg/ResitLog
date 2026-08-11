// Halaman letak sementara — disahkan setup projek berfungsi (fon, token warna, sudut tajam).
// Akan digantikan dengan logik pengalihan sebenar (→ /utama atau /mula) apabila Fasa 1 bermula.

export default function Halaman() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ground px-6 text-center">
      <div className="border-2 border-ink bg-maroon px-6 py-3">
        <span className="text-2xl font-extrabold tracking-tight text-ground">RESITLOG</span>
      </div>
      <p className="max-w-xs text-sm text-muted">
        Setup projek siap. Skrin sebenar akan dibina ikut fasa dalam BUILD-PHASES.
      </p>
    </main>
  );
}
