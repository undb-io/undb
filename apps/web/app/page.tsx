'use client'

import { getCurrentTableId, getCurrentViewId } from '@egodb/store'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useAppSelector } from '../hooks'
import App from './App'

export default function Page() {
  const currentTableId = useAppSelector(getCurrentTableId)
  const currentViewId = useAppSelector(getCurrentViewId)

  useEffect(() => {
    if (currentTableId) {
      if (currentViewId) {
        redirect(`/t/${currentTableId}/${currentViewId}`)
      } else {
        redirect(`/t/${currentTableId}`)
      }
    }
  }, [currentTableId, currentViewId])

  return <App />
}
