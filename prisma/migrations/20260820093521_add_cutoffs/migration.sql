-- CreateTable
CREATE TABLE "Cutoff" (
    "id" TEXT NOT NULL,
    "exam" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OPEN',
    "openingRank" INTEGER,
    "closingRank" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "collegeId" TEXT NOT NULL,
    "courseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cutoff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cutoff_exam_category_closingRank_idx" ON "Cutoff"("exam", "category", "closingRank");

-- CreateIndex
CREATE INDEX "Cutoff_collegeId_idx" ON "Cutoff"("collegeId");

-- AddForeignKey
ALTER TABLE "Cutoff" ADD CONSTRAINT "Cutoff_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cutoff" ADD CONSTRAINT "Cutoff_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
