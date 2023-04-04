import type { Table } from '@egodb/core'
import React from 'react'

export const CurrentTableContext = React.createContext<Table | null>(null)
