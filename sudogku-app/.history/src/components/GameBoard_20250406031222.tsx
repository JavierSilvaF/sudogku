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
    displayMode,
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

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col])
  }

  const isRelatedCell = (selectedCell: [number, number] | null, row: number, col: number): boolean => {
    if (!selectedCell) return false
    const [selectedRow, selectedCol] = selectedCell
    return (
      selectedRow === row ||
      selectedCol === col ||
      (Math.floor(selectedRow / 3) === Math.floor(row / 3) &&
        Math.floor(selectedCol / 3) === Math.floor(col / 3))
  }

  return (
    <div className='w-full max-w-[500px] mx-auto'>
      <div className='grid grid-cols-9 gap-[1px] bg-black dark:bg-black p-[1px] rounded-lg'>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected =
              selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
            const isRelated =
              selectedCell &&
              (selectedCell[0] === rowIndex ||
                selectedCell[1] === colIndex ||
                (Math.floor(selectedCell[0] / 3) === Math.floor(rowIndex / 3) &&
                  Math.floor(selectedCell[1] / 3) === Math.floor(colIndex / 3)))
            const cellPencilMarks = pencilMarks.get(`${rowIndex}-${colIndex}`)
            const hasPencilMarks = cellPencilMarks && cellPencilMarks.size > 0
            const hasError = errors.has(`${rowIndex}-${colIndex}`)

            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                className={`relative aspect-square w-full flex items-center justify-center text-2xl font-bold cursor-pointer select-none ${
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                    ? 'bg-gray-300 dark:bg-gray-500 border-2 border-blue-500'
                    : isRelatedCell(selectedCell, rowIndex, colIndex)
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : initialBoard[rowIndex][colIndex] !== null
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : ''
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                whileTap={{ scale: 0.95 }}
              >
                {cell !== null ? (
                  displayMode === 'dogs' ? (
                    <div className='w-full h-full flex items-center justify-center'>
                      <DogImage number={cell} />
                    </div>
                  ) : (
                    <span>{cell}</span>
                  )
                ) : hasPencilMarks ? (
                  <div className='grid grid-cols-3 gap-0.5 w-full h-full text-xs'>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <div
                        key={num}
                        className='flex items-center justify-center'
                      >
                        {cellPencilMarks?.has(num) && num}
                      </div>
                    ))}
                  </div>
                ) : null}
              </motion.button>
            )
          })
        )}
      </div>
    </div>
  )
}
