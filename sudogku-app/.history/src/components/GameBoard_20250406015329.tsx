import { useGame } from '@/context/GameContext'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function GameBoard() {
  const {
    board,
    initialBoard,
    pencilMarks,
    setCellValue,
    togglePencilMark,
    selectedCell,
    setSelectedCell,
  } = useGame()
  const [isPencilMode, setIsPencilMode] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return

      const [row, col] = selectedCell

      // Number inputs
      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key)
        if (isPencilMode) {
          togglePencilMark(row, col, num)
        } else {
          setCellValue(row, col, num)
        }
      }

      // Delete/Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        setCellValue(row, col, null)
      }

      // Arrow key navigation
      if (e.key.startsWith('Arrow')) {
        e.preventDefault()
        const [newRow, newCol] = {
          ArrowUp: [Math.max(0, row - 1), col],
          ArrowDown: [Math.min(8, row + 1), col],
          ArrowLeft: [row, Math.max(0, col - 1)],
          ArrowRight: [row, Math.min(8, col + 1)],
        }[e.key]
        setSelectedCell([newRow, newCol])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCell, isPencilMode])

  return (
    <div className='w-full max-w-md aspect-square'>
      <div className='grid grid-cols-9 gap-px bg-gray-300 dark:bg-gray-600 p-px rounded-lg'>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.button
              key={`${rowIndex}-${colIndex}`}
              whileTap={{ scale: 0.95 }}
              className={`
                aspect-square flex items-center justify-center relative
                bg-white dark:bg-gray-800
                text-2xl font-bold
                ${
                  initialBoard[rowIndex][colIndex]
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-blue-600 dark:text-blue-400'
                }
                ${
                  selectedCell?.[0] === rowIndex &&
                  selectedCell?.[1] === colIndex
                    ? 'bg-blue-50 dark:bg-blue-900'
                    : ''
                }
                ${(rowIndex + 1) % 3 === 0 ? 'border-b-2' : ''}
                ${(colIndex + 1) % 3 === 0 ? 'border-r-2' : ''}
                hover:bg-blue-50 dark:hover:bg-blue-900/50
                transition-colors
              `}
              onClick={() => setSelectedCell([rowIndex, colIndex])}
            >
              {cell || ''}
              {!cell && pencilMarks.get(`${rowIndex}-${colIndex}`) && (
                <div className='grid grid-cols-3 gap-px text-xs absolute inset-0 p-1'>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <span
                      key={num}
                      className='flex items-center justify-center text-gray-500 dark:text-gray-400'
                    >
                      {pencilMarks.get(`${rowIndex}-${colIndex}`)?.has(num)
                        ? num
                        : ''}
                    </span>
                  ))}
                </div>
              )}
            </motion.button>
          ))
        )}
      </div>
    </div>
  )
}
