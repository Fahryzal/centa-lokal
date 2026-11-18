-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('SUCCESS', 'ERROR');

-- CreateTable
CREATE TABLE "service_logs" (
    "id" TEXT NOT NULL,
    "status" "LogStatus" NOT NULL,
    "action" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "actorId" TEXT,
    "moduleName" TEXT,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "httpStatus" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "requestBody" JSONB,
    "responseBody" JSONB,
    "errorDetail" TEXT,
    "errorStack" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "service_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_logs_createdAt_idx" ON "service_logs"("createdAt");

-- CreateIndex
CREATE INDEX "service_logs_actorId_idx" ON "service_logs"("actorId");

-- CreateIndex
CREATE INDEX "service_logs_moduleName_idx" ON "service_logs"("moduleName");

-- AddForeignKey
ALTER TABLE "service_logs" ADD CONSTRAINT "service_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
