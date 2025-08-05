import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const data = await prisma.kredit.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { amount, tanggalPengambilan } = await req.json();
  const data = await prisma.kredit.create({
    data: {
      amount: parseInt(amount),
      tanggalPengambilan: new Date(tanggalPengambilan),
    },
  });
  return NextResponse.json(data);
}
