import { createContext, useContext, useState, useEffect } from 'react'

type GameMode = 'easy' | 'medium' | 'hard'
type CellValue = number | null
type PencilMarks = Set<number>

interface GameContextType {
  board: CellValue[][]
  initialBoard: CellValue[][]
  pencilMarks: Map<string, PencilMarks>
  gameMode: GameMode
  timer: number
  isComplete: boolean
  isPaused: boolean
  setGameMode: (mode: GameMode) => void
  setCellValue: (row: number, col: number, value: CellValue) => void
  togglePencilMark: (row: number, col: number, value: number) => void
  checkSolution: () => boolean
  revealSolution: () => void
  resetGame: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [board, setBoard] = useState<CellValue[][]>(
    Array(9).fill(Array(9).fill(null))
  )
  const [initialBoard, setInitialBoard] = useState<CellValue[][]>(
    Array(9).fill(Array(9).fill(null))
  )
  const [pencilMarks, setPencilMarks] = useState<Map<string, PencilMarks>>(
    new Map()
  )
  const [gameMode, setGameMode] = useState<GameMode>('medium')
  const [timer, setTimer] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Add game logic here (we'll implement this next)

  const value = {
    board,
    initialBoard,
    pencilMarks,
    gameMode,
    timer,
    isComplete,
    isPaused,
    setGameMode,
    setCellValue: (row: number, col: number, value: CellValue) => {},
    togglePencilMark: (row: number, col: number, value: number) => {},
    checkSolution: () => false,
    revealSolution: () => {},
    resetGame: () => {},
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
