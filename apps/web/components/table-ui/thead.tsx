import React from 'react'
import { AddFieldButton } from '../table/add-field.button'
import type { THeaderGroup } from './interface'
import { Th } from './th'

export const Thead: React.FC<{ headerGroup: THeaderGroup }> = ({ headerGroup }) => {
  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <Th header={header} key={header.id} />
      ))}
      <th>
        <AddFieldButton />
      </th>
    </tr>
  )
}
