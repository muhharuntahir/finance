import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ PUT: Update amount / tanggalPengembalian
export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "Missing ID in URL" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const updated = await prisma.kredit.update({
      where: { id },
      data: {
        amount: BigInt(body.amount),
        tanggalPengembalian: body.tanggalPengembalian
          ? new Date(body.tanggalPengembalian)
          : null,
      },
    });

    return NextResponse.json({
      ...updated,
      amount: updated.amount.toString(),
    });
  } catch (error) {
    console.error("PUT /api/kredit/[id] failed:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate data" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Hapus data kredit
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "Missing ID in URL" }, { status: 400 });
  }

  try {
    const deleted = await prisma.kredit.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Berhasil dihapus",
      deleted: {
        ...deleted,
        amount: deleted.amount.toString(),
      },
    });
  } catch (error) {
    console.error("DELETE /api/kredit/[id] failed:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data" },
      { status: 500 }
    );
  }
}
