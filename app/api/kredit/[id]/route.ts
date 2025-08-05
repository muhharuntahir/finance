// app/api/kredit/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        amount: body.amount,
        tanggalPengembalian: body.tanggalPengembalian
          ? new Date(body.tanggalPengembalian)
          : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
