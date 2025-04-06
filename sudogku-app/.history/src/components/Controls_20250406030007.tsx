import { useGame } from '@/context/GameContext'
import { motion } from 'framer-motion'
import { DogImage } from '@/utils/dogImages'

export default function Controls() {
  const { gameMode, setGameMode, displayMode, isPencilMode, togglePencilMode } =
    useGame()

  return (
    <div className='w-full max-w-[500px] mx-auto mt-8'>
      <div className='grid grid-cols-3 gap-4'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <motion.button
            key={number}
            className='aspect-square w-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md'
            whileTap={{ scale: 0.95 }}
          >
            {displayMode === 'dogs' ? (
              <DogImage number={number} />
            ) : (
              <span className='text-2xl font-bold'>{number}</span>
            )}
          </motion.button>
        ))}
      </div>
      <motion.button
        className={`w-full mt-4 p-4 rounded-lg shadow-md flex items-center justify-center gap-2 ${
          isPencilMode
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700'
        }`}
        onClick={togglePencilMode}
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
            d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
          />
        </svg>
        <span>Pencil Mode</span>
      </motion.button>
    </div>
  )
}
