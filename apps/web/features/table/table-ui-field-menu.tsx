import type { Field } from '@egodb/core'
import { ActionIcon, IconDots, Menu } from '@egodb/ui'
import { FieldMenuDropdown } from '../field/field-menu-dropdown'

export const TableUIFieldMenu: React.FC<{ field: Field; index: number }> = ({ field, index }) => {
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
}
