import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Statistics {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  bestStreak: number
  averageTime: number
  bestTime: number
}

export default function Stats() {
  const [stats, setStats] = useState<Statistics>({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0,
    averageTime: 0,
    bestTime: 0,
  })

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('sudogku-stats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  const formatTime = (seconds: number) => {
    if (seconds === 0) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg'
    >
      <h2 className='text-lg font-bold mb-4'>Statistics</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
        <div className='text-center'>
          <div className='text-2xl font-bold'>{stats.gamesPlayed}</div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>Played</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold'>
            {stats.gamesPlayed
              ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
              : 0}
            %
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Win Rate
          </div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold'>{stats.currentStreak}</div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>Streak</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold'>{formatTime(stats.bestTime)}</div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Best Time
          </div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold'>
            {formatTime(stats.averageTime)}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Avg Time
          </div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold'>{stats.bestStreak}</div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Best Streak
          </div>
        </div>
      </div>
    </motion.div>
  )
}
