'use client'

import { getCurrentTableId } from '@egodb/store'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useAppSelector } from '../hooks'
import App from './App'

export default function Page() {
  const currentTableId = useAppSelector(getCurrentTableId)

  useEffect(() => {
    if (currentTableId) {
      redirect(`/t/${currentTableId}`)
    }
  }, [currentTableId])

  return <App />
}
