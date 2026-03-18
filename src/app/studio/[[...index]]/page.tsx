'use client'

import { useEffect } from 'react'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  useEffect(() => {
    document.body.classList.add('is-studio')
    return () => { document.body.classList.remove('is-studio') }
  }, [])

  return <NextStudio config={config} />
}
