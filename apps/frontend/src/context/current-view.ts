import type { View } from '@egodb/core'
import React from 'react'

export const CurrentViewContext = React.createContext<View | null>(null)
