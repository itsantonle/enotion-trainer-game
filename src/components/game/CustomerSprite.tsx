import { motion } from "framer-motion";
import type { CustomerData } from "@/data/gameData";

interface CustomerSpriteProps {
  customer: CustomerData;
  isTalking?: boolean;
  className?: string;
}

export function CustomerSprite({ customer, isTalking, className }: CustomerSpriteProps) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", damping: 15 }}
      className={`flex flex-col items-center ${className ?? ""}`}
    >
      <motion.img
        src={customer.sprite}
        alt={customer.name}
        className="h-full w-full max-h-full max-w-full object-contain drop-shadow-lg"
        animate={isTalking ? { y: [0, -4, 0] } : {}}
        transition={isTalking ? { repeat: Infinity, duration: 0.6 } : {}}
      />
      <motion.div
        className="mt-1 rounded-full px-3 py-0.5 text-[10px] font-bold shadow-md md:mt-2 md:px-4 md:py-1 md:text-sm"
        style={{
          background: "hsl(25, 50%, 90%)",
          color: "hsl(25, 60%, 30%)",
          border: "2px solid hsl(25, 50%, 70%)",
        }}
      >
        {customer.name}
      </motion.div>
    </motion.div>
  );
}
