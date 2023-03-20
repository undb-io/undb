import type { Field } from '@egodb/core'
import { ActionIcon, IconDots, Menu } from '@egodb/ui'
import type { Header } from '@tanstack/react-table'
import React from 'react'
import { FieldMenuDropdown } from '../field/field-menu-dropdown'
import type { TData } from '../table-ui/interface'

interface IProps {
  field: Field
  index: number
  header: Header<TData, unknown>
}

// eslint-disable-next-line react/display-name
export const TableUIFieldMenu: React.FC<IProps> = React.memo(({ field, index, header }) => {
  const pinned = header.column.getIsPinned()

  return (
    <Menu width={250}>
      <Menu.Target>
        <ActionIcon size="sm" variant="light">
          <IconDots size={14} />
        </ActionIcon>
      </Menu.Target>

      <FieldMenuDropdown
        field={field}
        orientation="horizontal"
        index={index}
        pinned={!!pinned}
        pinLeft={() => (pinned ? header.column.pin(false) : header.column.pin('left'))}
      />
    </Menu>
  )
})
