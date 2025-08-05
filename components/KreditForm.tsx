"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { NumericFormat } from "react-number-format";

type Props = {
  onAdded: () => void;
};

export default function KreditForm({ onAdded }: Props) {
  const [amount, setAmount] = useState<number | "">("");
  const [tanggalPengambilan, setTanggalPengambilan] = useState<
    Date | undefined
  >(new Date());

  const handleAdd = async () => {
    if (!amount || !tanggalPengambilan) return;

    await fetch("/api/kredit", {
      method: "POST",
      body: JSON.stringify({ amount, tanggalPengambilan }),
    });

    setAmount("");
    setTanggalPengambilan(new Date());
    onAdded();
  };

  return (
    <div className="grid gap-3 mb-8 sm:grid-cols-2 md:grid-cols-3">
      <NumericFormat
        thousandSeparator="."
        decimalSeparator=","
        prefix="Rp "
        allowNegative={false}
        value={amount}
        onValueChange={(values) => {
          const raw = values.value;
          setAmount(raw === "" ? "" : parseInt(raw));
        }}
        customInput={Input}
        placeholder="Masukkan jumlah kredit"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full text-left">
            {tanggalPengambilan
              ? format(tanggalPengambilan, "dd/MM/yyyy")
              : "Pilih Tanggal"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-white border shadow-md p-0 rounded-md">
          <Calendar
            mode="single"
            selected={tanggalPengambilan}
            onSelect={setTanggalPengambilan}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        className="bg-blue-800 hover:bg-blue-600 text-white w-full sm:w-auto"
        onClick={handleAdd}
      >
        Tambah
      </Button>
    </div>
  );
}
