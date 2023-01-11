import { useAtomsDevtools } from 'jotai-devtools'
import React from 'react'

export const AtomsDevtools: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAtomsDevtools('ego')
  return <>{children}</>
}
