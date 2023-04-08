import type { Table } from '@undb/core'
import React from 'react'

export const CurrentTableContext = React.createContext<Table | null>(null)
