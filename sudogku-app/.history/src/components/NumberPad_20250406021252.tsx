import { motion } from 'framer-motion'
import { useGame } from '@/context/GameContext'
import { useState } from 'react'
import { DogImage } from '@/utils/dogImages'

export default function NumberPad() {
  const { selectedCell, setCellValue, togglePencilMark } = useGame()
  const [isPencilMode, setIsPencilMode] = useState(false)

  const handleNumberClick = (num: number) => {
    if (!selectedCell) return
    const [row, col] = selectedCell

    if (isPencilMode) {
      togglePencilMark(row, col, num)
    } else {
      setCellValue(row, col, num)
    }
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg sm:hidden'>
      <div className='max-w-md mx-auto'>
        <div className='grid grid-cols-5 gap-2 mb-4'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              whileTap={{ scale: 0.95 }}
              className='aspect-square rounded-lg bg-gray-100 dark:bg-gray-700
                text-xl font-bold flex items-center justify-center'
              onClick={() => handleNumberClick(num)}
            >
              <DogImage number={num} size={30} />
            </motion.button>
          ))}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`aspect-square rounded-lg flex items-center justify-center
              ${
                isPencilMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            onClick={() => setIsPencilMode((prev: boolean) => !prev)}
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
        </div>
      </div>
    </div>
  )
}
