import { motion, AnimatePresence } from 'framer-motion'
import { DogImage } from '@/utils/dogImages'
import { useGame } from '@/context/GameContext'
import { useState } from 'react'

interface NumberPopupProps {
  isOpen: boolean
  onClose: () => void
  position: { x: number; y: number }
  cellPosition: [number, number]
}

export default function NumberPopup({
  isOpen,
  onClose,
  position,
  cellPosition,
}: NumberPopupProps) {
  const { setCellValue, togglePencilMark, initialBoard, board } = useGame()
  const [isPencilMode, setIsPencilMode] = useState(false)
  const [row, col] = cellPosition
  const isInitialCell = initialBoard[row][col] !== null
  const hasValue = board[row][col] !== null

  const handleNumberClick = (num: number) => {
    if (isInitialCell) return

    if (isPencilMode) {
      togglePencilMark(row, col, num)
    } else {
      setCellValue(row, col, num)
    }
    onClose()
  }

  const handleErase = () => {
    if (isInitialCell) return
    setCellValue(row, col, null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-40'
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className='absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3'
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: 'translate(-50%, -100%)',
              marginTop: '-10px',
            }}
          >
            <div className='grid grid-cols-3 gap-2 mb-2'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <motion.button
                  key={num}
                  whileTap={{ scale: 0.9 }}
                  className='aspect-square rounded-lg bg-gray-100 dark:bg-gray-700 
                    flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600'
                  onClick={() => handleNumberClick(num)}
                  disabled={isInitialCell}
                >
                  <DogImage number={num} size={30} />
                </motion.button>
              ))}
            </div>

            <div className='flex justify-between'>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`px-3 py-1 rounded-lg text-sm font-medium
                  ${
                    isPencilMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                onClick={() => setIsPencilMode(!isPencilMode)}
                disabled={isInitialCell}
              >
                Pencil
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className='px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium'
                onClick={handleErase}
                disabled={isInitialCell || !hasValue}
              >
                Erase
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
