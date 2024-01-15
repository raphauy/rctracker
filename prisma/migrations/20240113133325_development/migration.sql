-- CreateTable
CREATE TABLE "Development" (
    "id" TEXT NOT NULL,
    "comments" TEXT,
    "actualHours" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "Development_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Development" ADD CONSTRAINT "Development_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
