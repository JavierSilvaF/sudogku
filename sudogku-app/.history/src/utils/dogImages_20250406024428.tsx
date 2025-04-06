import Image from 'next/image'

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

// Component to display a dog image for a number
export function DogImage({
  number,
  size = 40,
}: {
  number: number
  size?: number
}) {
  return (
    <div className='relative' style={{ width: size, height: size }}>
      <Image
        src={dogImages[number as keyof typeof dogImages]}
        alt={`Dog ${number}`}
        fill
        style={{ objectFit: 'cover' }}
        className='rounded-full'
      />
    </div>
  )
}
