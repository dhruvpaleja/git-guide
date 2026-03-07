-- CreateTable
CREATE TABLE "VideoRoom" (
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

    CONSTRAINT "VideoRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoRoom_sessionId_key" ON "VideoRoom"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoRoom_roomName_key" ON "VideoRoom"("roomName");

-- CreateIndex
CREATE INDEX "VideoRoom_sessionId_idx" ON "VideoRoom"("sessionId");

-- AddForeignKey
ALTER TABLE "VideoRoom" ADD CONSTRAINT "VideoRoom_sessionId_fkey" 
    FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
