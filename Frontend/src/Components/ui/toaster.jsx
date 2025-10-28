"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        style: { borderRadius: "8px", padding: "12px" },
      }}
    />
  );
}
