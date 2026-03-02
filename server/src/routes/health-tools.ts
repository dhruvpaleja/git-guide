import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../shared/middleware/validate.middleware.js';
import {
  moodEntrySchema,
  journalEntrySchema,
  meditationLogSchema,
} from '../validators/health-tools.validator.js';
import {
  getMoodHistory,
  recordMoodEntry,
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  getMeditationLogs,
  logMeditationSession,
} from '../controllers/health-tools.controller.js';

const router = Router();

// All health-tools routes require auth
router.use(requireAuth);

// Mood
router.get('/mood', getMoodHistory);
router.post('/mood', validate(moodEntrySchema), recordMoodEntry);

// Journal
router.get('/journal', getJournalEntries);
router.post('/journal', validate(journalEntrySchema), createJournalEntry);
router.put('/journal/:id', updateJournalEntry);

// Meditation
router.get('/meditation', getMeditationLogs);
router.post('/meditation', validate(meditationLogSchema), logMeditationSession);

export default router;
