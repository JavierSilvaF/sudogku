import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/context/GameContext'

export default function Victory() {
  const { isComplete, timer, isDailyPuzzle } = useGame()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4'
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl'
          >
            <h2 className='text-2xl font-bold mb-4 text-center'>
              🎉 Puzzle Complete! 🎉
            </h2>
            <div className='space-y-4'>
              <p className='text-center'>
                Time: <span className='font-mono'>{formatTime(timer)}</span>
              </p>
              {isDailyPuzzle && (
                <div className='text-center text-sm'>
                  Come back tomorrow for a new daily puzzle!
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='w-full py-2 px-4 bg-blue-600 text-white rounded-full font-medium'
                onClick={() => window.location.reload()}
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
