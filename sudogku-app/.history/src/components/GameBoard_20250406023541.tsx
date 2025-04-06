import { useGame } from '@/context/GameContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { DogImage } from '@/utils/dogImages'
import NumberPopup from './NumberPopup'

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
    displayMode,
  } = useGame()
  const [isPencilMode, setIsPencilMode] = useState(false)
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const [popupCell, setPopupCell] = useState<[number, number] | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

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

  const handleCellClick = (
    row: number,
    col: number,
    event: React.MouseEvent
  ) => {
    setSelectedCell([row, col])

    // Only show popup for non-initial cells
    if (initialBoard[row][col] === null) {
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      setPopupPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      })
      setPopupCell([row, col])
      setPopupOpen(true)
    }
  }

  const closePopup = () => {
    setPopupOpen(false)
  }

  const relatedCells = selectedCell ? getRelatedCells(...selectedCell) : []
  const relatedCellsSet = new Set(relatedCells.map(([r, c]) => `${r}-${c}`))

  const isCellIncorrect = (row: number, col: number) => {
    const cellValue = board[row][col]
    return cellValue !== null && cellValue !== solution[row][col]
  }

  return (
    <div className='relative'>
      <div className='grid grid-cols-9 gap-0.5 bg-gray-300 dark:bg-gray-700 p-0.5 rounded-lg'>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected =
              selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
            const isInitial = initialBoard[rowIndex][colIndex] !== null
            const isIncorrect = isCellIncorrect(rowIndex, colIndex)
            const cellPencilMarks = pencilMarks.get(`${rowIndex}-${colIndex}`)

            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`
                  aspect-square flex items-center justify-center
                  ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-white dark:bg-gray-800'
                  }
                  ${isIncorrect ? 'bg-red-100 dark:bg-red-900' : ''}
                  ${isInitial ? 'font-bold' : ''}
                  ${getBorderClasses(rowIndex, colIndex)}
                  relative
                `}
              >
                {cell !== null ? (
                  <DogImage number={cell} size={40} />
                ) : cellPencilMarks ? (
                  <div className='grid grid-cols-3 gap-0.5 w-full h-full p-1'>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <div
                        key={num}
                        className='flex items-center justify-center text-xs'
                      >
                        {cellPencilMarks.has(num) && (
                          <DogImage number={num} size={12} />
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </motion.button>
            )
          })
        )}
      </div>
      <AnimatePresence>
        {popupOpen && popupCell && (
          <NumberPopup
            isOpen={popupOpen}
            position={popupPosition}
            cell={popupCell}
            onClose={closePopup}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
