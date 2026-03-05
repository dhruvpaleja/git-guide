import { useState } from 'react';
import { Mic, ArrowUp, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '@/services/api.service';

export default function TheConfessional({ onFocusChange }: { onFocusChange?: (focused: boolean) => void }) {
    const [isFocused, setIsFocused] = useState(false);
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const prompt = 'What\'s on your mind today?';

    const handleFocus = () => {
        setIsFocused(true);
        onFocusChange?.(true);
    };

    const handleBlur = () => {
        if (!text) {
            setIsFocused(false);
            onFocusChange?.(false);
        }
    };

    const handleSubmit = async () => {
        if (!text.trim() || isSubmitting) return;
        setIsSubmitting(true);
        await apiService.post('/health-tools/journal', {
            title: 'Confessional',
            content: text.trim(),
            isPrivate: true,
        });
        setIsSubmitting(false);
        setSubmitted(true);
        setText('');
        setTimeout(() => {
            setSubmitted(false);
            setIsFocused(false);
            onFocusChange?.(false);
        }, 2000);
    };

    return (
        <div className={cn(
            "w-full transition-all duration-700 ease-in-out relative",
            isFocused ? "z-50" : "z-10"
        )}>
            <div className={cn(
                "relative w-full rounded-[20px] border transition-all duration-700 overflow-hidden flex flex-col group",
                isFocused
                    ? "bg-[#050507]/95 border-white/[0.08] h-[240px] shadow-[0_0_80px_-20px_rgba(180,120,60,0.08)] ring-1 ring-white/[0.04] backdrop-blur-3xl"
                    : "bg-white/[0.015] border-white/[0.04] h-[80px] hover:bg-white/[0.025] hover:border-white/[0.06] backdrop-blur-xl"
            )}>
                {/* Warm ambient glow when focused */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-20 bg-amber-500/[0.04] blur-[50px] pointer-events-none rounded-full"
                        />
                    )}
                </AnimatePresence>

                {submitted ? (
                    <div className="flex-1 flex items-center justify-center gap-3" role="status" aria-live="polite">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400/80" />
                        <span className="text-white/50 text-[13px] font-medium">Recorded. Your constellation updates.</span>
                    </div>
                ) : (
                    <textarea
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={prompt}
                        className={cn(
                            "flex-1 w-full bg-transparent resize-none p-5 sm:p-6 placeholder:text-white/18 focus:outline-none tracking-[-0.01em] hide-scrollbar font-medium transition-all duration-700 relative z-10",
                            isFocused ? "text-[16px] sm:text-[18px] text-white/80 leading-relaxed" : "text-[14px] text-white/50"
                        )}
                    />
                )}

                {/* Bottom Action Bar */}
                {!submitted && (
                    <div className="h-12 px-4 pb-3 w-full flex items-center justify-between mt-auto">
                        <button
                            className="flex items-center gap-2 group/mic px-2.5 py-1.5 rounded-xl hover:bg-white/[0.03] transition-colors"
                            title="Voice input"
                            type="button"
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                isFocused ? "bg-amber-500/[0.06] border border-amber-500/10" : "bg-white/[0.03] border border-white/[0.04]"
                            )}>
                                <Mic className={cn(
                                    "w-3.5 h-3.5 transition-colors",
                                    isFocused ? "text-amber-400/60" : "text-white/25 group-hover/mic:text-white/45"
                                )} />
                            </div>
                            {isFocused && (
                                <span className="text-[11px] font-medium text-white/25 group-hover/mic:text-white/45 transition-colors">
                                    Record
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {(text.length > 0 && isFocused) && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    type="button"
                                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <ArrowUp className="w-4 h-4" />
                                    }
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
