import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ GET: Ambil semua data kredit
export async function GET() {
  try {
    const data = await prisma.kredit.findMany({
      orderBy: { tanggalPengambilan: "asc" },
    });

    // ❗ Ubah bigint ke string agar bisa di-serialize
    const serialized = data.map((item) => ({
      ...item,
      amount: item.amount.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("GET /api/kredit failed:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kredit" },
      { status: 500 }
    );
  }
}

// ✅ POST: Tambah data kredit baru
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newKredit = await prisma.kredit.create({
      data: {
        amount: BigInt(body.amount),
        tanggalPengambilan: new Date(body.tanggalPengambilan),
      },
    });

    return NextResponse.json({
      ...newKredit,
      amount: newKredit.amount.toString(),
    });
  } catch (error) {
    console.error("POST /api/kredit failed:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data kredit" },
      { status: 500 }
    );
  }
}
