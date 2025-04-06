import { useGame } from '@/context/GameContext'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { DogImage } from '@/utils/dogImages'

export default function GameBoard() {
  const {
    board,
    initialBoard,
    pencilMarks,
    setCellValue,
    togglePencilMark,
    selectedCell,
    setSelectedCell,
    solution,
  } = useGame()
  const [isPencilMode, setIsPencilMode] = useState(false)
  const [errors, setErrors] = useState<Set<string>>(new Set())

  // Get related cells (same row, column, box, or same number)
  const getRelatedCells = (row: number, col: number): [number, number][] => {
    const related: [number, number][] = []
    const selectedValue = board[row][col]

    // Same row
    for (let c = 0; c < 9; c++) {
      if (c !== col) related.push([row, c])
    }

    // Same column
    for (let r = 0; r < 9; r++) {
      if (r !== row) related.push([r, col])
    }

    // Same 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (r !== row || c !== col) related.push([r, c])
      }
    }

    // Same number
    if (selectedValue) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if ((r !== row || c !== col) && board[r][c] === selectedValue) {
            related.push([r, c])
          }
        }
      }
    }

    return related
  }

  // Check for errors in the current cell
  const checkCellError = (row: number, col: number): boolean => {
    if (!board[row][col]) return false
    return board[row][col] !== solution[row][col]
  }

  // Update errors when board changes
  useEffect(() => {
    const newErrors = new Set<string>()
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (checkCellError(row, col)) {
          newErrors.add(`${row}-${col}`)
        }
      }
    }
    setErrors(newErrors)
  }, [board, solution])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return

      const [row, col] = selectedCell

      if (e.key === 'p') {
        setIsPencilMode((prev) => !prev)
        return
      }

      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key)
        if (isPencilMode) {
          togglePencilMark(row, col, num)
        } else {
          setCellValue(row, col, num)
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        setCellValue(row, col, null)
      }

      if (e.key.startsWith('Arrow')) {
        e.preventDefault()
        const newPosition = {
          ArrowUp: [Math.max(0, row - 1), col],
          ArrowDown: [Math.min(8, row + 1), col],
          ArrowLeft: [row, Math.max(0, col - 1)],
          ArrowRight: [row, Math.min(8, col + 1)],
        }[e.key] as [number, number]
        setSelectedCell(newPosition)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCell, isPencilMode])

  const relatedCells = selectedCell ? getRelatedCells(...selectedCell) : []
  const relatedCellsSet = new Set(relatedCells.map(([r, c]) => `${r}-${c}`))

  return (
    <div className='w-full max-w-md aspect-square'>
      <div className='grid grid-cols-9 gap-px bg-gray-300 dark:bg-gray-600 p-px rounded-lg'>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected =
              selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
            const isRelated = relatedCellsSet.has(`${rowIndex}-${colIndex}`)
            const hasError = errors.has(`${rowIndex}-${colIndex}`)

            return (
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
                    isSelected
                      ? 'bg-gray-200 dark:bg-gray-600 shadow-inner'
                      : isRelated
                      ? 'bg-blue-50/50 dark:bg-blue-900/30'
                      : ''
                  }
                  ${hasError ? 'text-red-500 dark:text-red-400' : ''}
                  ${(rowIndex + 1) % 3 === 0 ? 'border-b-2' : ''}
                  ${(colIndex + 1) % 3 === 0 ? 'border-r-2' : ''}
                  hover:bg-blue-50 dark:hover:bg-blue-900/50
                  transition-colors
                `}
                onClick={() => setSelectedCell([rowIndex, colIndex])}
              >
                {cell ? (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <DogImage number={cell} size={30} />
                  </motion.div>
                ) : (
                  ''
                )}
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
            )
          })
        )}
      </div>
    </div>
  )
}
