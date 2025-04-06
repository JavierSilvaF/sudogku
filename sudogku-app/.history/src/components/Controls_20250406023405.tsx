import { useGame } from '@/context/GameContext'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { DogImage } from '@/utils/dogImages'

export default function Controls() {
  const {
    checkSolution,
    revealSolution,
    resetGame,
    displayMode,
    toggleDisplayMode,
  } = useGame()
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const [isPencilMode, setIsPencilMode] = useState(false)

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDisplayMode}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors'
        >
          {displayMode === 'dogs' ? 'Show Numbers' : 'Show Dogs'}
        </motion.button>
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
          >
            <DogImage number={num} size={30} />
          </motion.button>
        ))}
      </div>

      <div className='grid grid-cols-4 gap-2'>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`col-span-1 p-2 rounded-lg flex items-center justify-center
            ${
              isPencilMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
          onClick={() => setIsPencilMode(!isPencilMode)}
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
            />
          </svg>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className='col-span-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-800
            hover:bg-gray-200 dark:hover:bg-gray-700'
          onClick={checkSolution}
        >
          Check
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className='col-span-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-800
            hover:bg-gray-200 dark:hover:bg-gray-700'
          onClick={revealSolution}
        >
          Reveal
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className='col-span-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-800
            hover:bg-gray-200 dark:hover:bg-gray-700'
          onClick={resetGame}
        >
          Reset
        </motion.button>
      </div>
    </div>
  )
}
