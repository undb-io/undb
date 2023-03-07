import type { Field } from '@egodb/core'
import { ActionIcon, IconDots, Menu } from '@egodb/ui'
import React from 'react'
import { FieldMenuDropdown } from '../field/field-menu-dropdown'

// eslint-disable-next-line react/display-name
export const TableUIFieldMenu: React.FC<{ field: Field; index: number }> = React.memo(({ field, index }) => {
  return (
    <Menu width={250}>
      <Menu.Target>
        <ActionIcon>
          <IconDots size={14} />
        </ActionIcon>
      </Menu.Target>

      <FieldMenuDropdown field={field} orientation="horizontal" index={index} />
    </Menu>
  )
})
