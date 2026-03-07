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
  deleteMoodEntry,
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getMeditationLogs,
  logMeditationSession,
  deleteMeditationLog,
} from '../controllers/health-tools.controller.js';

const router = Router();

// All health-tools routes require auth
router.use(requireAuth);

// Mood
router.get('/mood', getMoodHistory);
router.post('/mood', validate(moodEntrySchema), recordMoodEntry);
router.delete('/mood/:id', deleteMoodEntry);

// Journal
router.get('/journal', getJournalEntries);
router.post('/journal', validate(journalEntrySchema), createJournalEntry);
router.put('/journal/:id', updateJournalEntry);
router.delete('/journal/:id', deleteJournalEntry);

// Meditation
router.get('/meditation', getMeditationLogs);
router.post('/meditation', validate(meditationLogSchema), logMeditationSession);
router.delete('/meditation/:id', deleteMeditationLog);

export default router;
