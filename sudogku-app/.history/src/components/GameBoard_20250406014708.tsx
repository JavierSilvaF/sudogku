import { useGame } from '@/context/GameContext'
import { motion } from 'framer-motion'

export default function GameBoard() {
  const { board, initialBoard, pencilMarks, setCellValue, togglePencilMark } =
    useGame()

  return (
    <div className='w-full max-w-md aspect-square'>
      <div className='grid grid-cols-9 gap-px bg-gray-300 dark:bg-gray-600 p-px rounded-lg'>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.button
              key={`${rowIndex}-${colIndex}`}
              whileTap={{ scale: 0.95 }}
              className={`
                aspect-square flex items-center justify-center
                bg-white dark:bg-gray-800
                text-2xl font-bold
                ${
                  initialBoard[rowIndex][colIndex]
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-blue-600 dark:text-blue-400'
                }
                ${(rowIndex + 1) % 3 === 0 ? 'border-b-2' : ''}
                ${(colIndex + 1) % 3 === 0 ? 'border-r-2' : ''}
              `}
              onClick={() => {
                /* Handle cell click */
              }}
            >
              {cell || ''}
              {!cell && pencilMarks.get(`${rowIndex}-${colIndex}`) && (
                <div className='grid grid-cols-3 gap-px text-xs absolute inset-0 p-1'>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <span
                      key={num}
                      className='flex items-center justify-center'
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
