import { useGame } from '@/context/GameContext'
import { motion } from 'framer-motion'
import { DogImage } from '@/utils/dogImages'
import { useState } from 'react'

export default function Controls() {
  const {
    gameMode,
    setGameMode,
    displayMode,
    isPencilMode,
    togglePencilMode,
    checkSolution,
    isComplete,
  } = useGame()

  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<boolean | null>(null)

  const handleCheckSolution = () => {
    setIsChecking(true)
    setCheckResult(null)

    // Simulate a brief delay for visual feedback
    setTimeout(() => {
      const result = checkSolution()
      setCheckResult(result)
      setIsChecking(false)

      // Reset the result after 3 seconds
      setTimeout(() => {
        setCheckResult(null)
      }, 3000)
    }, 500)
  }

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
              <div className='w-full h-full flex items-center justify-center'>
                <DogImage number={number} />
              </div>
            ) : (
              <span className='text-2xl font-bold'>{number}</span>
            )}
          </motion.button>
        ))}
      </div>

      <div className='flex flex-col gap-4 mt-4'>
        <motion.button
          className={`w-full p-4 rounded-lg shadow-md flex items-center justify-center gap-2 ${
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

        <motion.button
          className={`w-full p-4 rounded-lg shadow-md flex items-center justify-center gap-2 ${
            isChecking
              ? 'bg-yellow-500 text-white'
              : checkResult === true
              ? 'bg-green-500 text-white'
              : checkResult === false
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
          onClick={handleCheckSolution}
          whileTap={{ scale: 0.95 }}
          disabled={isComplete || isChecking}
        >
          {isChecking ? (
            <>
              <svg
                className='animate-spin h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              <span>Checking...</span>
            </>
          ) : checkResult === true ? (
            <>
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
                  d='M5 13l4 4L19 7'
                />
              </svg>
              <span>Correct!</span>
            </>
          ) : checkResult === false ? (
            <>
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
              <span>Incorrect</span>
            </>
          ) : (
            <>
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
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>Check Solution</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
