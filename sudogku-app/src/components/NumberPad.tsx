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
    <div className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg sm:hidden'>
      <div className='max-w-md mx-auto'>
        <div className='grid grid-cols-5 gap-2 mb-4'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <motion.button
              key={number}
              className='aspect-square w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg'
              onClick={() => handleNumberClick(number)}
              whileTap={{ scale: 0.95 }}
            >
              {displayMode === 'dogs' ? (
                <div className='w-full h-full flex items-center justify-center'>
                  <DogImage number={number} />
                </div>
              ) : (
                <span className='text-xl font-bold'>{number}</span>
              )}
            </motion.button>
          ))}
        </div>

        <div className='flex justify-center gap-2'>
          <motion.button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isPencilMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => {}}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className='w-5 h-5'
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
            Pencil
          </motion.button>
          <motion.button
            className='px-4 py-2 rounded-lg bg-red-500 text-white font-medium flex items-center gap-2'
            onClick={handleErase}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className='w-5 h-5'
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
            Erase
          </motion.button>
        </div>
      </div>
    </div>
  )
}
