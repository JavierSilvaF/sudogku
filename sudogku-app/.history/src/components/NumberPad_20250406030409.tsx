import { motion } from 'framer-motion'
import { useGame } from '@/context/GameContext'
import { DogImage } from '@/utils/dogImages'

export default function NumberPad() {
  const {
    selectedCell,
    setCellValue,
    togglePencilMark,
    isPencilMode,
    displayMode,
  } = useGame()

  const handleNumberClick = (number: number) => {
    if (!selectedCell) return

    if (isPencilMode) {
      togglePencilMark(selectedCell[0], selectedCell[1], number)
    } else {
      setCellValue(selectedCell[0], selectedCell[1], number)
    }
  }

  const handleErase = () => {
    if (!selectedCell) return
    setCellValue(selectedCell[0], selectedCell[1], null)
  }

  return (
    <div className='w-full max-w-[500px] mx-auto mt-8'>
      <div className='grid grid-cols-3 gap-4'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <motion.button
            key={number}
            className='aspect-square w-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md'
            onClick={() => handleNumberClick(number)}
            whileTap={{ scale: 0.95 }}
          >
            {displayMode === 'dogs' ? (
              <div className='w-full h-full flex items-center justify-center'>
                <DogImage number={number} />
              </div>
            ) : (
              <span className='text-2xl font-bold'>{number}</span>
            )}
          </motion.button>
        ))}
      </div>
      <motion.button
        className='w-full mt-4 p-4 bg-red-500 text-white rounded-lg shadow-md flex items-center justify-center gap-2'
        onClick={handleErase}
        whileTap={{ scale: 0.95 }}
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
            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
          />
        </svg>
        <span>Erase</span>
      </motion.button>
    </div>
  )
}
