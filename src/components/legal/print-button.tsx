"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg font-medium"
    >
      <Printer className="h-5 w-5" />
      Imprimer le Document (PDF)
    </button>
  );
}
