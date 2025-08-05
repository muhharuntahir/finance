import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { tanggalPengembalian } = await req.json();
  const updated = await prisma.kredit.update({
    where: { id: params.id },
    data: {
      tanggalPengembalian: new Date(tanggalPengembalian),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.kredit.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}
