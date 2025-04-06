'use client'

import { ThemeProvider } from 'next-themes'
import { GameProvider } from '@/context/GameContext'
import Header from '@/components/Header'
import GameBoard from '@/components/GameBoard'
import NumberPad from '@/components/NumberPad'
import Victory from '@/components/Victory'
import Stats from '@/components/Stats'

export default function Home() {
  return (
    <ThemeProvider attribute='class' enableSystem defaultTheme='system'>
      <GameProvider>
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50'>
          <div className='max-w-2xl mx-auto px-4 py-8 pb-32 sm:pb-8'>
            <Header />
            <main className='flex flex-col items-center gap-6'>
              <GameBoard />
              <Stats />
            </main>
          </div>
          <NumberPad />
          <Victory />
        </div>
      </GameProvider>
    </ThemeProvider>
  )
}
