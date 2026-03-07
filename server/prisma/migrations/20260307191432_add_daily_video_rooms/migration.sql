-- CreateTable
CREATE TABLE "DailyVideoRoom" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "roomUrl" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "recordingUrl" TEXT,
    "recordingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyVideoRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyVideoRoom_sessionId_key" ON "DailyVideoRoom"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyVideoRoom_roomName_key" ON "DailyVideoRoom"("roomName");

-- CreateIndex
CREATE INDEX "DailyVideoRoom_sessionId_idx" ON "DailyVideoRoom"("sessionId");

-- AddForeignKey
ALTER TABLE "DailyVideoRoom" ADD CONSTRAINT "DailyVideoRoom_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
