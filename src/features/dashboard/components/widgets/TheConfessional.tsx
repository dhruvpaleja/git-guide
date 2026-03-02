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
                "relative w-full rounded-2xl border transition-all duration-700 overflow-hidden flex flex-col group",
                isFocused
                    ? "bg-[#060608]/95 border-white/[0.12] h-[260px] shadow-[0_0_80px_-20px_rgba(255,255,255,0.08)] ring-1 ring-white/[0.06] backdrop-blur-3xl"
                    : "bg-white/[0.015] border-white/[0.05] h-[88px] hover:bg-white/[0.03] hover:border-white/[0.08] backdrop-blur-xl"
            )}>
                {/* Ambient glow when focused */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-24 bg-accent/8 blur-[50px] pointer-events-none rounded-full"
                        />
                    )}
                </AnimatePresence>

                {submitted ? (
                    <div className="flex-1 flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-white/60 text-sm font-medium">Recorded. Your constellation updates.</span>
                    </div>
                ) : (
                    <textarea
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={prompt}
                        className={cn(
                            "flex-1 w-full bg-transparent resize-none p-5 sm:p-6 placeholder:text-white/20 focus:outline-none tracking-[-0.01em] hide-scrollbar font-medium transition-all duration-700 relative z-10",
                            isFocused ? "text-lg sm:text-xl text-white/85 leading-relaxed" : "text-[15px] text-white/55"
                        )}
                    />
                )}

                {/* Bottom Action Bar */}
                {!submitted && (
                    <div className="h-12 px-4 pb-3 w-full flex items-center justify-between mt-auto">
                        <button
                            className="flex items-center gap-2 group/mic px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                            title="Voice input"
                            type="button"
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                                isFocused ? "bg-accent/8 border border-accent/15" : "bg-white/[0.04] border border-white/[0.06]"
                            )}>
                                <Mic className={cn(
                                    "w-3.5 h-3.5 transition-colors",
                                    isFocused ? "text-accent/70" : "text-white/35 group-hover/mic:text-white/60"
                                )} />
                            </div>
                            {isFocused && (
                                <span className="text-xs font-medium text-white/35 group-hover/mic:text-white/60 transition-colors">
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
                                    className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors disabled:opacity-50"
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
