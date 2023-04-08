import type { View } from '@undb/core'
import React from 'react'

export const CurrentViewContext = React.createContext<View | null>(null)
