/*
  Warnings:

  - Added the required column `academicYearId` to the `Semester` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Semester" ADD COLUMN     "academicYearId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Semester" ADD CONSTRAINT "Semester_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
