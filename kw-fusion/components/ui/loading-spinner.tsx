'use client'

import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <div className="relative w-8 h-8">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: 7,
          ease: "linear",
          repeat: Infinity
        }}
      >
        {[...Array(13)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-full origin-center"
            style={{
              rotate: `${i * 27.7}deg`,
            }}
          >
            <motion.div
              className="absolute top-0 left-1/2 w-1.5 h-1.5 -ml-[3px]"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.75,
                repeat: Infinity,
                delay: i * -0.1,
              }}
              style={{
                background: `hsl(${i * 28}, 100%, 65%)`,
                boxShadow: `0 0 12px hsl(${i * 28}, 100%, 65%)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
