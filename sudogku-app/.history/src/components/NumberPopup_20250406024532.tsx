import { motion, AnimatePresence } from 'framer-motion'
import { DogImage } from '@/utils/dogImages'
import { useGame } from '@/context/GameContext'
import { useState, useEffect } from 'react'

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
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const [row, col] = cellPosition

  // Adjust position to keep popup within viewport
  useEffect(() => {
    if (isOpen) {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Calculate popup dimensions
      const popupWidth = 180 // Approximate width of popup
      const popupHeight = 180 // Approximate height of popup

      // Calculate adjusted position
      let x = position.x
      let y = position.y

      // Adjust horizontal position if needed
      if (x + popupWidth / 2 > viewportWidth) {
        x = viewportWidth - popupWidth / 2 - 10
      } else if (x - popupWidth / 2 < 0) {
        x = popupWidth / 2 + 10
      }

      // Adjust vertical position if needed
      if (y - popupHeight < 0) {
        // If popup would go above viewport, show it below the cell instead
        y = position.y + 50 // Approximate cell height
      }

      setAdjustedPosition({ x, y })
    }
  }, [isOpen, position])

  const handleNumberClick = (num: number) => {
    if (initialBoard[row][col] !== null) return

    if (isPencilMode) {
      togglePencilMark(row, col, num)
    } else {
      setCellValue(row, col, num)
    }
    onClose()
  }

  const handleErase = () => {
    if (initialBoard[row][col] !== null) return
    setCellValue(row, col, null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black z-40'
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className='fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3'
            style={{
              left: `${adjustedPosition.x}px`,
              top: `${adjustedPosition.y}px`,
              transform: 'translate(-50%, -100%)',
              marginTop: '-10px',
            }}
          >
            <div className='grid grid-cols-3 gap-2'>
              {numbers.map((num) => (
                <motion.button
                  key={num}
                  whileTap={{ scale: 0.9 }}
                  className='w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700'
                  onClick={() => handleNumberClick(num)}
                >
                  <DogImage number={num} size={30} />
                </motion.button>
              ))}
            </div>

            <div className='flex justify-between mt-2'>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1
                  ${
                    isPencilMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                onClick={() => setIsPencilMode((prev) => !prev)}
              >
                <svg
                  className='w-4 h-4'
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
                Pencil
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className='px-3 py-1 rounded-lg text-sm bg-gray-100 dark:bg-gray-700'
                onClick={handleErase}
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
