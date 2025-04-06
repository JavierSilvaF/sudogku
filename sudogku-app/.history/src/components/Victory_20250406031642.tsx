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
    stats,
    resetGame,
  } = useGame()
  const [showResults, setShowResults] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleViewResults = () => {
    setShowResults(true)
  }

  const handleCloseResults = () => {
    setShowResults(false)
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
              {!showResults ? (
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
              ) : (
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
                            {displayMode === 'dogs' ? (
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
                            )}
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
                  <motion.button
                    className='w-full p-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md mt-4'
                    onClick={handleCloseResults}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
