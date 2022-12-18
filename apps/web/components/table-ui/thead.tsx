import React from 'react'
import type { THeaderGroup } from './interface'
import { Th } from './th'

export const Thead: React.FC<{ headerGroup: THeaderGroup; tableId: string }> = ({ headerGroup, tableId }) => {
  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <Th header={header} key={header.id} tableId={tableId} />
      ))}
    </tr>
  )
}
