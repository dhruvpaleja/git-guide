import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricCardProps {
    title: string;
    date: string;
    amount: string; // Base original amount
    badgeText: string;
    theme: 'green' | 'red';
}

export function MetricCard({ title, date, amount, badgeText, theme }: MetricCardProps) {
    const isGreen = theme === 'green';

    // Theme colors
    const borderColor = isGreen ? 'border-green-200' : 'border-red-200';
    const titleColor = isGreen ? 'text-green-800/70' : 'text-red-800/70';
    const dateColor = isGreen ? 'text-green-400' : 'text-red-400';
    const amountColor = isGreen ? 'text-green-950' : 'text-red-950';
    const badgeBg = isGreen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    const viewDetailsColor = isGreen ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600';

    // State for live fluctuating value
    const [currentAmount, setCurrentAmount] = useState(amount);

    // Paths for animation (Base path vs slightly shifted path to mimic stock movement)
    const greenPaths = [
        "M0 30 Q 15 30, 25 20 T 50 15 T 75 25 T 100 0",
        "M0 35 Q 15 25, 25 10 T 50 20 T 75 10 T 100 -5",
        "M0 25 Q 15 35, 25 25 T 50 10 T 75 15 T 100 5"
    ];

    const redPaths = [
        "M0 10 Q 15 10, 25 25 T 50 35 T 75 20 T 100 5",
        "M0 5 Q 15 20, 25 15 T 50 25 T 75 15 T 100 15",
        "M0 15 Q 15 5, 25 35 T 50 20 T 75 30 T 100 10"
    ];

    const activePaths = isGreen ? greenPaths : redPaths;
    const [pathIndex, setPathIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // Cycle through paths smoothly
            setPathIndex((prev) => (prev + 1) % activePaths.length);

            // Subtly fluctuate the text value (parse the number down, modify, stringify)
            // Expecting amount format like "₹5.5k.55" or "₹18.8k.50"
            const numMatch = amount.match(/([0-9.]+)/);
            if (numMatch) {
                const baseNumber = parseFloat(numMatch[1]);
                // fluctuate by +/- 0.3
                const fluctuation = (Math.random() * 0.6) - 0.3;
                const newValue = (baseNumber + fluctuation).toFixed(1);

                // Reconstruct string
                const prefix = amount.substring(0, numMatch.index);
                const suffixMatch = amount.substring(numMatch.index! + numMatch[1].length);
                setCurrentAmount(`${prefix}${newValue}${suffixMatch}`);
            }
        }, 2500);

        return () => clearInterval(interval);
    }, [amount, activePaths.length]);

    // Calculate end point for the blinking circle based on current path's last point (roughly)
    // For simplicity, we keep the X static at 100, and shift Y based on the path cycle.
    const getEndPointY = (index: number) => {
        if (isGreen) {
            return index === 0 ? 0 : index === 1 ? -5 : 5;
        } else {
            return index === 0 ? 5 : index === 1 ? 15 : 10;
        }
    };

    return (
        <div className={`flex-1 min-w-[200px] p-5 rounded-[24px] border ${borderColor} bg-white shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow`}>

            {/* Header: Title and Date */}
            <div className="flex justify-between items-center mb-2">
                <span className={`text-[13px] font-medium ${titleColor}`}>{title}</span>
                <span className={`text-[10px] uppercase font-medium tracking-wide ${dateColor}`}>{date}</span>
            </div>

            {/* Content: Value and Chart Area */}
            <div className="flex items-end justify-between relative z-10 w-full">
                <div className="flex flex-col min-w-[100px]">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentAmount}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className={`text-2xl font-semibold tracking-tight ${amountColor} mb-3`}
                        >
                            {currentAmount}
                        </motion.span>
                    </AnimatePresence>

                    <div className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit flex items-center gap-1 ${badgeBg}`}>
                        <ArrowUpRight className="w-3 h-3" />
                        {badgeText}
                    </div>
                </div>

                {/* Decorative Chart Line with Framer Motion */}
                <div className="w-24 h-12 ml-auto mb-2 relative">
                    <svg viewBox="0 0 100 40" className="w-full h-full fill-none overflow-visible" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <motion.path
                            animate={{ d: activePaths[pathIndex] }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className={isGreen ? "stroke-green-400" : "stroke-red-400"}
                        />
                        <motion.circle
                            cx="100"
                            animate={{ cy: getEndPointY(pathIndex) }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            r="3"
                            className={isGreen ? "fill-green-400" : "fill-red-400"}
                        />
                    </svg>

                    {/* Blinking Aura behind the dot */}
                    <motion.div
                        className={`absolute w-4 h-4 rounded-full blur-[4px] -m-2 opacity-50 ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                        animate={{
                            top: `${((getEndPointY(pathIndex) + 5) / 45) * 100}%`,
                            right: '-8px',
                            scale: [1, 2, 1],
                            opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                            top: { duration: 2, ease: "easeInOut" },
                            scale: { duration: 1.5, repeat: Infinity },
                            opacity: { duration: 1.5, repeat: Infinity }
                        }}
                    />
                </div>
            </div>

            {/* View Details Link */}
            <button className={`absolute bottom-5 right-5 text-[11px] font-medium transition-colors ${viewDetailsColor}`}>
                View Details
            </button>

            {/* Background Hint (faint blur from bottom left like Figma) */}
            <div className={`absolute -bottom-10 -left-10 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}></div>
        </div>
    );
}
