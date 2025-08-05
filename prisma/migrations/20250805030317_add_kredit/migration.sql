-- CreateTable
CREATE TABLE "public"."Kredit" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "tanggalPengambilan" TIMESTAMP(3) NOT NULL,
    "tanggalPengembalian" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kredit_pkey" PRIMARY KEY ("id")
);
