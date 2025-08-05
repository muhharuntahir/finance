"use client";

import KreditForm from "@/components/KreditForm";
import KreditTable from "@/components/KreditTable";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Perhitungan Kredit Bank Standby Loan
      </h1>
      <KreditForm onAdded={() => location.reload()} />
      <KreditTable />
    </main>
  );
}
