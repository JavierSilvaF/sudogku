import Image from 'next/image'
import { useGame } from '@/context/GameContext'

// Map numbers to dog image paths
export const dogImages = {
  1: '/images/dogs/dog1.png',
  2: '/images/dogs/dog2.png',
  3: '/images/dogs/dog3.png',
  4: '/images/dogs/dog4.png',
  5: '/images/dogs/dog5.png',
  6: '/images/dogs/dog6.png',
  7: '/images/dogs/dog7.png',
  8: '/images/dogs/dog8.png',
  9: '/images/dogs/dog9.png',
}

interface DogImageProps {
  number: number
  size?: number
}

export function DogImage({ number, size = 40 }: DogImageProps) {
  const { displayMode } = useGame()

  if (displayMode === 'numbers') {
    return (
      <span className='font-bold' style={{ fontSize: `${size * 0.6}px` }}>
        {number}
      </span>
    )
  }

  return (
    <img
      src={`/images/dogs/dog${number}.png`}
      alt={`Dog ${number}`}
      width={size}
      height={size}
      className='object-contain'
    />
  )
}
