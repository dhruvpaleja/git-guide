/**
 * AddNodeModal
 * Beautiful modal for adding new nodes to the constellation.
 * Step-by-step flow: Category → Label → Emotion → Intensity → Position
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import type { NodeCategory, NodeEmotion, NodeIntensity, CreateNodePayload } from '../types/index.js';
import { CATEGORY_CONFIGS, EMOTION_CONFIGS } from '../types/index.js';

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateNodePayload) => Promise<void>;
}

type Step = 'category' | 'details' | 'emotion' | 'intensity' | 'confirm';
const STEPS: Step[] = ['category', 'details', 'emotion', 'intensity', 'confirm'];

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIGS) as NodeCategory[];
const ALL_EMOTIONS = Object.keys(EMOTION_CONFIGS) as NodeEmotion[];

export default function AddNodeModal({ isOpen, onClose, onSubmit }: AddNodeModalProps) {
  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState<NodeCategory | null>(null);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [emotion, setEmotion] = useState<NodeEmotion | null>(null);
  const [intensity, setIntensity] = useState<NodeIntensity>(3);
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const canGoNext =
    (step === 'category' && category !== null) ||
    (step === 'details' && label.trim().length > 0) ||
    (step === 'emotion' && emotion !== null) ||
    step === 'intensity' ||
    step === 'confirm';

  const goNext = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }, [step]);

  const goBack = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }, [step]);

  const resetAndClose = useCallback(() => {
    setStep('category');
    setCategory(null);
    setLabel('');
    setDescription('');
    setEmotion(null);
    setIntensity(3);
    setTags('');
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    if (!category || !emotion || !label.trim()) return;
    setIsSubmitting(true);

    const payload: CreateNodePayload = {
      label: label.trim(),
      description: description.trim() || `A ${CATEGORY_CONFIGS[category].label.toLowerCase()} node.`,
      category,
      emotion,
      intensity,
      // Deterministic-ish position in the middle zone
      x: 25 + ((label.charCodeAt(0) * 7) % 50),
      y: 25 + ((label.charCodeAt(0) * 13) % 50),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    await onSubmit(payload);
    setIsSubmitting(false);
    resetAndClose();
  }, [category, emotion, label, description, intensity, tags, onSubmit, resetAndClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={resetAndClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-[30px] bg-[#0c0c0c] border border-[#2b2b2b] shadow-2xl overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-accent/[0.04] rounded-full blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="relative px-8 pt-8 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">Add to Constellation</h2>
              <p className="text-sm text-white/40 mt-1">Map a new part of your emotional universe</p>
            </div>
            <button
              onClick={resetAndClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          </div>

          {/* Progress */}
          <div className="px-8 mb-2">
            <div className="flex gap-1.5">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i <= stepIndex ? 'hsl(174, 72%, 40%)' : 'rgba(255,255,255,0.06)',
                    opacity: i <= stepIndex ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -15, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Category selection */}
                {step === 'category' && (
                  <div>
                    <h3 className="text-sm text-white/50 uppercase tracking-wider font-medium mb-4">
                      What area of your life?
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {ALL_CATEGORIES.filter((c) => c !== 'self').map((cat) => {
                        const cfg = CATEGORY_CONFIGS[cat];
                        const isActive = category === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={cn(
                              'relative flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200',
                              isActive
                                ? 'bg-white/[0.06] border-white/20'
                                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10 hover:bg-white/[0.04]',
                            )}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="cat-selected"
                                className="absolute inset-0 rounded-2xl border-2"
                                style={{ borderColor: cfg.color + '40' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              />
                            )}
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: isActive ? cfg.bgColor : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${isActive ? cfg.borderColor : 'rgba(255,255,255,0.06)'}`,
                              }}
                            >
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color, opacity: isActive ? 1 : 0.4 }} />
                            </div>
                            <span className={cn('text-sm font-medium', isActive ? 'text-white' : 'text-white/50')}>
                              {cfg.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Label & Description */}
                {step === 'details' && (
                  <div>
                    <h3 className="text-sm text-white/50 uppercase tracking-wider font-medium mb-4">
                      Name this node
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-white/30 uppercase tracking-wider mb-2 block">Label</label>
                        <input
                          type="text"
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          placeholder="e.g., Career Burnout, New Relationship, Health Goal"
                          maxLength={50}
                          className="w-full h-12 px-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-colors text-sm"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/30 uppercase tracking-wider mb-2 block">Description</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="What's going on with this? How does it affect you?"
                          maxLength={300}
                          rows={3}
                          className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-colors text-sm resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/30 uppercase tracking-wider mb-2 block">
                          Tags <span className="text-white/20">(comma-separated)</span>
                        </label>
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="e.g., work, stress, growth"
                          className="w-full h-10 px-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-colors text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Emotion selection */}
                {step === 'emotion' && (
                  <div>
                    <h3 className="text-sm text-white/50 uppercase tracking-wider font-medium mb-4">
                      What's the dominant emotion?
                    </h3>
                    <div className="grid grid-cols-3 gap-2.5">
                      {ALL_EMOTIONS.map((em) => {
                        const cfg = EMOTION_CONFIGS[em];
                        const isActive = emotion === em;
                        return (
                          <button
                            key={em}
                            onClick={() => setEmotion(em)}
                            className={cn(
                              'flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200',
                              isActive
                                ? 'bg-white/[0.06] border-white/20 scale-[1.02]'
                                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10',
                            )}
                          >
                            <span className="text-2xl">{cfg.emoji}</span>
                            <span className={cn('text-xs font-medium', isActive ? 'text-white' : 'text-white/40')}>
                              {cfg.label}
                            </span>
                            {isActive && (
                              <motion.div
                                layoutId="emotion-dot"
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: cfg.color }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Intensity */}
                {step === 'intensity' && (
                  <div>
                    <h3 className="text-sm text-white/50 uppercase tracking-wider font-medium mb-4">
                      How intense is this?
                    </h3>
                    <div className="flex flex-col items-center gap-8 py-8">
                      <div className="text-center">
                        <p className="text-6xl font-bold text-white mb-2">{intensity}</p>
                        <p className="text-sm text-white/40">
                          {intensity === 1 && 'Subtle background presence'}
                          {intensity === 2 && 'Noticeable but manageable'}
                          {intensity === 3 && 'Significantly impactful'}
                          {intensity === 4 && 'Dominating your awareness'}
                          {intensity === 5 && 'Overwhelming everything'}
                        </p>
                      </div>
                      <div className="flex gap-3 w-full max-w-xs">
                        {([1, 2, 3, 4, 5] as NodeIntensity[]).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setIntensity(lvl)}
                            className={cn(
                              'flex-1 h-12 rounded-2xl border transition-all duration-200 text-sm font-semibold',
                              intensity === lvl
                                ? 'bg-white text-black border-white scale-105'
                                : intensity >= lvl
                                  ? 'bg-white/10 border-white/20 text-white/70'
                                  : 'bg-white/[0.02] border-white/[0.06] text-white/30 hover:border-white/10',
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirmation */}
                {step === 'confirm' && category && emotion && (
                  <div>
                    <h3 className="text-sm text-white/50 uppercase tracking-wider font-medium mb-4">
                      Confirm your node
                    </h3>
                    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                          style={{
                            backgroundColor: CATEGORY_CONFIGS[category].bgColor,
                            borderColor: CATEGORY_CONFIGS[category].borderColor,
                          }}
                        >
                          <span className="text-xl">{EMOTION_CONFIGS[emotion].emoji}</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{label || 'Untitled'}</p>
                          <p className="text-xs text-white/40">
                            {CATEGORY_CONFIGS[category].label} · {EMOTION_CONFIGS[emotion].label} · Intensity {intensity}
                          </p>
                        </div>
                      </div>
                      {description && <p className="text-sm text-white/50 leading-relaxed">{description}</p>}
                      {tags && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/40">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-white/30 mt-3 text-center">
                      The node will appear in your constellation map. You can drag it to reposition.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex items-center justify-between">
            <button
              onClick={stepIndex > 0 ? goBack : resetAndClose}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
            >
              {stepIndex > 0 ? (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </>
              ) : (
                'Cancel'
              )}
            </button>

            {step === 'confirm' ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-all disabled:opacity-50 shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Adding...
                  </span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Add to Constellation
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={goNext}
                disabled={!canGoNext}
                className={cn(
                  'flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold text-sm transition-all',
                  canGoNext
                    ? 'bg-white text-black hover:bg-gray-200 shadow-lg'
                    : 'bg-white/5 text-white/20 cursor-not-allowed',
                )}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
