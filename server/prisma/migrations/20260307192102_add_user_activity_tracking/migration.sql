-- CreateTable
CREATE TABLE "UserActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventCategory" TEXT NOT NULL,
    "target" TEXT,
    "targetText" TEXT,
    "value" TEXT,
    "page" TEXT NOT NULL,
    "component" TEXT,
    "section" TEXT,
    "metadata" JSONB,
    "deviceType" TEXT,
    "browser" TEXT,
    "screenWidth" INTEGER,
    "screenHeight" INTEGER,
    "userAgent" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserActivity_userId_timestamp_idx" ON "UserActivity"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "UserActivity_sessionId_idx" ON "UserActivity"("sessionId");

-- CreateIndex
CREATE INDEX "UserActivity_eventType_idx" ON "UserActivity"("eventType");

-- CreateIndex
CREATE INDEX "UserActivity_page_idx" ON "UserActivity"("page");

-- CreateIndex
CREATE INDEX "UserActivity_eventCategory_idx" ON "UserActivity"("eventCategory");

-- CreateIndex
CREATE INDEX "UserActivity_createdAt_idx" ON "UserActivity"("createdAt");

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
