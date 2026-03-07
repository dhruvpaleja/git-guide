-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "astrologerNotes" TEXT,
ADD COLUMN     "bookingSource" TEXT NOT NULL DEFAULT 'search',
ADD COLUMN     "matchReason" TEXT,
ADD COLUMN     "matchScore" DOUBLE PRECISION,
ADD COLUMN     "priceAtBooking" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sessionType" TEXT NOT NULL DEFAULT 'standard',
ADD COLUMN     "therapistPrivateNotes" TEXT,
ADD COLUMN     "userPaidAmount" INTEGER;

-- CreateTable
CREATE TABLE "TherapyJourney" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completedSessionCount" INTEGER NOT NULL DEFAULT 0,
    "activeTherapistCount" INTEGER NOT NULL DEFAULT 0,
    "firstSessionAt" TIMESTAMP(3),
    "lastSessionAt" TIMESTAMP(3),
    "totalSpent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapyJourney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapistOnlineStatus" (
    "id" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAcceptingNow" BOOLEAN NOT NULL DEFAULT false,
    "currentSessionId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapistOnlineStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNudge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nudgeType" TEXT NOT NULL,
    "nudgeData" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "shownAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    "actedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "cooldownUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNudge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapistMetrics" (
    "id" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "specializationStats" JSONB NOT NULL DEFAULT '{}',
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCompletedSessions" INTEGER NOT NULL DEFAULT 0,
    "totalCancelledSessions" INTEGER NOT NULL DEFAULT 0,
    "noShowRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clientReturnRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgSessionDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bookingFillRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "responseTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "computedPrice" INTEGER NOT NULL DEFAULT 500,
    "lastComputedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapistMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TherapyJourney_userId_key" ON "TherapyJourney"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TherapistOnlineStatus_therapistId_key" ON "TherapistOnlineStatus"("therapistId");

-- CreateIndex
CREATE INDEX "UserNudge_userId_status_idx" ON "UserNudge"("userId", "status");

-- CreateIndex
CREATE INDEX "UserNudge_nudgeType_idx" ON "UserNudge"("nudgeType");

-- CreateIndex
CREATE UNIQUE INDEX "TherapistMetrics_therapistId_key" ON "TherapistMetrics"("therapistId");

-- AddForeignKey
ALTER TABLE "TherapyJourney" ADD CONSTRAINT "TherapyJourney_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistOnlineStatus" ADD CONSTRAINT "TherapistOnlineStatus_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNudge" ADD CONSTRAINT "UserNudge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistMetrics" ADD CONSTRAINT "TherapistMetrics_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
