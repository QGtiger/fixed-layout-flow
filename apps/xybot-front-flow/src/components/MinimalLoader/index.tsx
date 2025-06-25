import { motion } from "framer-motion";

export function MinimalLoader() {
  return (
    <motion.div
      className=" absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          animate={{
            scaleX: [0, 1, 0],
            x: ["-50%", "0%", "50%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
          }}
        />
      </div>
    </motion.div>
  );
}
