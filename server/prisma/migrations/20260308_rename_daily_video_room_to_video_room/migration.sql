-- AlterTable
-- Rename DailyVideoRoom to VideoRoom
-- This migration renames the table and updates all foreign key references

-- Step 1: Drop foreign key constraint from Session table
ALTER TABLE "Session" DROP CONSTRAINT IF EXISTS "Session_videoRoom_fkey";

-- Step 2: Rename the table
ALTER TABLE "DailyVideoRoom" RENAME TO "VideoRoom";

-- Step 3: Recreate foreign key constraint
ALTER TABLE "Session" ADD CONSTRAINT "Session_videoRoom_fkey" 
  FOREIGN KEY ("videoRoom") REFERENCES "VideoRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Note: Indexes and primary keys are automatically renamed with the table
