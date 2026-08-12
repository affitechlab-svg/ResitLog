"use client";

import { useEffect } from "react";

export default function PendaftarServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Diam-diam gagal — app tetap berfungsi tanpa cache luar talian.
      });
    }
  }, []);

  return null;
}
