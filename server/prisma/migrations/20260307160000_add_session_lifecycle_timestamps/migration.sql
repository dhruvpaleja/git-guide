-- AlterTable: Add lifecycle timestamps to Session for complete data capture
ALTER TABLE "Session" ADD COLUMN "startedAt" TIMESTAMP(3);
ALTER TABLE "Session" ADD COLUMN "completedAt" TIMESTAMP(3);
ALTER TABLE "Session" ADD COLUMN "ratedAt" TIMESTAMP(3);
