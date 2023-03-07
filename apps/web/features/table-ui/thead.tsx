import { flexRender } from '@tanstack/react-table'
import React from 'react'
import type { THeaderGroup } from './interface'

// eslint-disable-next-line react/display-name
export const Thead: React.FC<{ headerGroup: THeaderGroup }> = React.memo(({ headerGroup }) => {
  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => flexRender(header.column.columnDef.header, header.getContext()))}
    </tr>
  )
})
