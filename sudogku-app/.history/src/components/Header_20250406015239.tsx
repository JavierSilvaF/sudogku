import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useGame } from '@/context/GameContext'
import { motion } from 'framer-motion'

export default function Header() {
  const { setTheme, theme } = useTheme()
  const { gameMode, setGameMode, timer, isDailyPuzzle, switchToDaily } =
    useGame()
  const [showRules, setShowRules] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  return (
    <header className='w-full mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Sudogku</h1>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => setShowRules(!showRules)}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full'
            aria-label='Show rules'
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
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full'
            aria-label='Toggle theme'
          >
            {theme === 'dark' ? (
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
                  d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
                />
              </svg>
            ) : (
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
                  d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4'>
        <div className='flex gap-2'>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm font-medium
              ${
                isDailyPuzzle
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            onClick={switchToDaily}
          >
            Daily Puzzle
          </motion.button>
          {!isDailyPuzzle && (
            <div className='flex gap-2'>
              {(['easy', 'medium', 'hard'] as const).map((mode) => (
                <motion.button
                  key={mode}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize
                    ${
                      gameMode === mode
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  onClick={() => setGameMode(mode)}
                >
                  {mode}
                </motion.button>
              ))}
            </div>
          )}
        </div>
        <div className='text-xl font-mono'>{formatTime(timer)}</div>
      </div>

      {showRules && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-4'
        >
          <h2 className='font-bold mb-2'>How to Play</h2>
          <ul className='text-sm space-y-2'>
            <li>
              • Fill in the grid so that every row, column, and 3x3 box contains
              the numbers 1-9
            </li>
            <li>• Use pencil marks to keep track of possible numbers</li>
            <li>• A new puzzle is available every day</li>
          </ul>
        </motion.div>
      )}
    </header>
  )
}
