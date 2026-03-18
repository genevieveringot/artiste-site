'use client'

import { useCallback, useEffect, useState } from 'react'
import { set, unset, NumberInputProps } from 'sanity'
import { useFormValue } from 'sanity'
import imageUrlBuilder from '@sanity/image-url'
import { useClient } from 'sanity'

export default function HeroOverlayInput(props: NumberInputProps) {
  const { onChange, value = 40, elementProps } = props
  const [localValue, setLocalValue] = useState(value)
  const mainImage = useFormValue(['mainImage']) as any
  const client = useClient({ apiVersion: '2024-01-01' })

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      setLocalValue(newValue)
      onChange(newValue === 40 ? unset() : set(newValue))
    },
    [onChange]
  )

  let imageUrl = ''
  if (mainImage?.asset?._ref) {
    const builder = imageUrlBuilder(client)
    imageUrl = builder.image(mainImage).width(600).url()
  }

  const opacity = Math.max(0, Math.min(100, localValue)) / 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {imageUrl && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Apercu hero"
            style={{ width: '100%', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, rgba(0,0,0,${opacity * 0.6}) 0%, rgba(0,0,0,${opacity}) 100%)`,
              transition: 'background 0.15s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontFamily: 'Georgia, serif',
              fontSize: '24px',
              fontWeight: 300,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              textAlign: 'center',
            }}
          >
            Apercu du hero
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: '#666', minWidth: '20px' }}>0</span>
        <input
          {...elementProps}
          type="range"
          min={0}
          max={100}
          value={localValue}
          onChange={handleChange}
          style={{
            flex: 1,
            height: '6px',
            cursor: 'pointer',
            accentColor: '#8B7355',
          }}
        />
        <span style={{ fontSize: '13px', color: '#666', minWidth: '30px' }}>100</span>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#333',
            minWidth: '40px',
            textAlign: 'center',
            background: '#f3f3f3',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          {localValue}%
        </span>
      </div>
    </div>
  )
}
