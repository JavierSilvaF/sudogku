import { useGame } from '@/context/GameContext'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Controls() {
  const { checkSolution, revealSolution, resetGame } = useGame()
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const [isPencilMode, setIsPencilMode] = useState(false)

  return (
    <div className='w-full max-w-md'>
      <div className='grid grid-cols-9 gap-1 mb-4'>
        {numbers.map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.95 }}
            className='aspect-square flex items-center justify-center
              bg-gray-100 dark:bg-gray-800 rounded-lg
              text-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-700'
            onClick={() => {
              /* Handle number input */
            }}
          >
            {num}
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
