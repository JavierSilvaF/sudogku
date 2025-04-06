import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/context/GameContext'
import { useState } from 'react'
import { DogImage } from '@/utils/dogImages'

export default function Victory() {
  const {
    isComplete,
    timer,
    isDailyPuzzle,
    board,
    solution,
    displayMode,
    resetGame,
    setShowVictory,
  } = useGame()
  const [showResults, setShowResults] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleViewResults = () => {
    setShowResults(true)
    setTimeout(() => {
      setShowVictory(false)
    }, 300)
  }

  const handleCloseResults = () => {
    setShowResults(false)
  }

  return (
    <AnimatePresence>
      {!showResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl'
          >
            <h2 className='text-2xl font-bold text-center mb-4'>
              Puzzle Complete!
            </h2>
            <p className='text-center mb-6'>
              Congratulations! You've completed the puzzle in{' '}
              {formatTime(timer)}.
            </p>

            <div className='flex flex-col gap-4'>
              <motion.button
                className='w-full p-4 bg-blue-500 text-white rounded-lg shadow-md'
                onClick={handleViewResults}
                whileTap={{ scale: 0.95 }}
              >
                View Results
              </motion.button>
              <motion.button
                className='w-full p-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md'
                onClick={resetGame}
                whileTap={{ scale: 0.95 }}
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
