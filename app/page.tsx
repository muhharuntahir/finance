"use client";

import KreditForm from "@/components/KreditForm";
import KreditTable from "@/components/KreditTable";

export default function Home() {
  return (
    <main>
      <div className="p-4 bg-blue-500 text-white width-full">
        <h1 className="text-md md:text-2xl font-bold ">
          Perhitungan Kredit Bank Standby Loan
        </h1>
      </div>
      <div className="pt-4 px-4 md:pt-8 md:px-12 max-w-screen mx-auto">
        <KreditForm onAdded={() => location.reload()} />
        <KreditTable />
      </div>
    </main>
  );
}
