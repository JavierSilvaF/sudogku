import { useGame } from '@/context/GameContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { DogImage } from '@/utils/dogImages'
import NumberPopup from './NumberPopup'

export default function GameBoard() {
  const {
    board,
    initialBoard,
    solution,
    pencilMarks,
    selectedCell,
    setSelectedCell,
    setCellValue,
    togglePencilMark,
    displayMode,
  } = useGame()

  const [popupOpen, setPopupOpen] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const [popupCell, setPopupCell] = useState<[number, number] | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const getBorderClasses = (rowIndex: number, colIndex: number) => {
    const classes = []
    if ((rowIndex + 1) % 3 === 0)
      classes.push('border-b-2 border-gray-300 dark:border-gray-600')
    if ((colIndex + 1) % 3 === 0)
      classes.push('border-r-2 border-gray-300 dark:border-gray-600')
    return classes.join(' ')
  }

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (initialBoard[rowIndex][colIndex] !== null) return

    setSelectedCell([rowIndex, colIndex])
    setPopupCell([rowIndex, colIndex])

    if (boardRef.current) {
      const cell = boardRef.current.children[0].children[
        rowIndex * 9 + colIndex
      ] as HTMLElement
      const rect = cell.getBoundingClientRect()
      const boardRect = boardRef.current.getBoundingClientRect()

      // Position the popup to the right of the cell
      setPopupPosition({
        x: rect.right + 10, // 10px gap from the cell
        y: rect.top + rect.height / 2, // Vertically centered with the cell
      })
    }

    setPopupOpen(true)
  }

  const closePopup = () => {
    setPopupOpen(false)
    setPopupCell(null)
  }

  const isCellIncorrect = (row: number, col: number) => {
    const cellValue = board[row][col]
    return cellValue !== null && cellValue !== solution[row][col]
  }

  return (
    <div className='relative' ref={boardRef}>
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
            cellPosition={popupCell}
            onClose={closePopup}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
