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
    const prompt = 'Spill. What generated that friction today?';

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
        // Save as a private journal entry — the Confessional is the ingestion engine
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
            isFocused ? "z-50 scale-[1.02]" : "z-10 scale-100"
        )}>

            {/* Label and instructions fade out on focus to reduce noise */}
            <AnimatePresence>
                {!isFocused && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between mb-3 px-2"
                    >
                        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-widest">The Confessional</h3>
                        <span className="text-xs text-white/30">Your Safe Room</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={cn(
                "relative w-full rounded-[30px] border transition-all duration-500 overflow-hidden flex flex-col",
                isFocused
                    ? "bg-[#111] border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.03)] h-[250px]"
                    : "bg-[#0c0c0c]/60 border-[#2b2b2b] h-[120px] hover:bg-[#111]"
            )}>
                {submitted ? (
                    <div className="flex-1 flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                        <span className="text-white/70 text-base font-medium">Received. The constellation updates.</span>
                    </div>
                ) : (
                    <textarea
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={prompt}
                        className="flex-1 w-full bg-transparent resize-none p-6 text-white/90 placeholder:text-white/30 focus:outline-none text-lg tracking-[-0.01em] leading-relaxed hide-scrollbar"
                    />
                )}

                {/* Bottom Action Bar */}
                {!submitted && (
                    <div className="h-16 px-4 pb-4 w-full flex items-center justify-between mt-auto">
                        {/* Voice Input Button */}
                        <button
                            className="flex items-center gap-2 group px-4 py-2 rounded-full hover:bg-white/5 transition-colors"
                            title="Voice Vent (3 min max)"
                            type="button"
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                isFocused ? "bg-accent/10 border border-accent/20" : "bg-white/5 border border-white/10 group-hover:border-white/20"
                            )}>
                                <Mic className={cn(
                                    "w-4 h-4 transition-colors",
                                    isFocused ? "text-accent" : "text-white/50 group-hover:text-white/80"
                                )} />
                            </div>
                            {isFocused && (
                                <span className="text-sm font-medium text-white/50 group-hover:text-white/80 transition-colors">Start Recording</span>
                            )}
                        </button>

                        {/* Submit Button */}
                        <AnimatePresence>
                            {(text.length > 0 && isFocused) && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    type="button"
                                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg disabled:opacity-50"
                                >
                                    {isSubmitting
                                        ? <Loader2 className="w-5 h-5 animate-spin" />
                                        : <ArrowUp className="w-5 h-5" />
                                    }
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Ambient Warm Glow at the bottom, mimicking the campfire effect */}
                {isFocused && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-accent/20 blur-[50px] pointer-events-none rounded-full" />
                )}
            </div>
        </div>
    );
}
