import { motion } from 'framer-motion';

export function GeometricLoader() {
  const shapes = [
    { type: 'circle', color: '#3b82f6' },
    { type: 'square', color: '#8b5cf6' },
    { type: 'triangle', color: '#ec4899' },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex items-center justify-center">
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: {
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
                delay: i * 0.2,
              },
              scale: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: i * 0.2,
              },
            }}
            style={{
              width: 80 - i * 10,
              height: 80 - i * 10,
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
            }}
          >
            {shape.type === 'circle' && (
              <div className="w-full h-full rounded-full" style={{ backgroundColor: shape.color, opacity: 0.8 }} />
            )}
            {shape.type === 'square' && (
              <div className="w-full h-full rounded-md" style={{ backgroundColor: shape.color, opacity: 0.8 }} />
            )}
            {shape.type === 'triangle' && (
              <div
                className="w-full h-full"
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  backgroundColor: shape.color,
                  opacity: 0.8,
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
