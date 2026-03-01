import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { StepProps } from './types';

export default function StepConfirmation({ onNext }: StepProps) {
  return (
    <div className="text-center max-w-sm mx-auto flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
      >
        <CheckCircle className="w-16 h-16 text-green-400" />
      </motion.div>

      <h2 className="text-[32px] font-semibold text-white mt-6">You're all set!</h2>
      <p className="text-[14px] text-white/50 mt-2">Your personalized healing journey is ready</p>

      <button
        onClick={onNext}
        className="bg-white text-black rounded-full h-[56px] w-[240px] font-semibold mt-10"
      >
        Enter Dashboard
      </button>
    </div>
  );
}
