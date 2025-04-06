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
  } = useGame()
  const [showResults, setShowResults] = useState(false)
  const [showVictory, setShowVictory] = useState(true)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleViewResults = () => {
    setShowVictory(false)
  }

  const handleCloseResults = () => {
    setShowVictory(true)
  }

  if (!isComplete) return null

  return (
    <AnimatePresence>
      {showVictory ? (
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
      ) : (
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
              Your Solution
            </h2>

            <div className='space-y-4'>
              <div className='grid grid-cols-9 gap-[1px] bg-black dark:bg-black p-[1px] rounded-lg'>
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isCorrect = cell === solution[rowIndex][colIndex]
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          aspect-square w-full flex items-center justify-center text-2xl font-bold
                          ${
                            isCorrect
                              ? 'bg-green-100 dark:bg-green-900'
                              : 'bg-red-100 dark:bg-red-900'
                          }
                          ${
                            colIndex % 3 === 2
                              ? 'border-r-2 border-black dark:border-white'
                              : ''
                          }
                          ${
                            rowIndex % 3 === 2
                              ? 'border-b-2 border-black dark:border-white'
                              : ''
                          }
                        `}
                      >
                        {cell !== null &&
                          (displayMode === 'dogs' ? (
                            <DogImage number={cell} />
                          ) : (
                            <span
                              className={
                                isCorrect
                                  ? 'text-green-800 dark:text-green-300'
                                  : 'text-red-800 dark:text-red-300'
                              }
                            >
                              {cell}
                            </span>
                          ))}
                      </div>
                    )
                  })
                )}
              </div>
              <div className='flex justify-between items-center mt-4'>
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 bg-green-100 dark:bg-green-900 rounded'></div>
                  <span className='text-sm'>Correct</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 bg-red-100 dark:bg-red-900 rounded'></div>
                  <span className='text-sm'>Incorrect</span>
                </div>
              </div>
              <div className='flex gap-4 mt-4'>
                <motion.button
                  className='flex-1 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md'
                  onClick={handleCloseResults}
                  whileTap={{ scale: 0.95 }}
                >
                  Back
                </motion.button>
                <motion.button
                  className='flex-1 p-4 bg-blue-500 text-white rounded-lg shadow-md'
                  onClick={resetGame}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
