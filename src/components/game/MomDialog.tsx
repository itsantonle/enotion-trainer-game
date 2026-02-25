import { motion } from "framer-motion";

interface MomDialogProps {
  message: string;
  isVisible: boolean;
}

export function MomDialog({ message, isVisible }: MomDialogProps) {
  if (!isVisible) return null;
  // Inline use only: rendered by parents inside dialog surfaces
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full rounded-xl border-2 border-pink-200/80 bg-pink-50/95 px-3 py-2 text-xs font-semibold text-pink-900 shadow-md md:text-sm"
    >
      Mama 👩: {message}
    </motion.div>
  );
}
