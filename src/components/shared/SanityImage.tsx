import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'

interface SanityImageProps {
  image: any
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
}

export default function SanityImage({
  image,
  alt,
  width,
  height,
  fill,
  className,
  priority = false,
  sizes,
}: SanityImageProps) {
  if (!image?.asset) return null

  const src = urlFor(image).url()

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes || '100vw'}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  )
}
