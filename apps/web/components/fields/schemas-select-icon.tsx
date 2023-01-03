import {
  Group,
  Icon123,
  IconCalendar,
  IconCalendarTime,
  IconLetterT,
  IconListCheck,
  IconSquareCheck,
  Text,
} from '@egodb/ui'
import { forwardRef } from 'react'

export const getSchemasIcon = (icon: string) => {
  switch (icon) {
    case 'string':
      return <IconLetterT size={16} />
    case 'number':
      return <Icon123 size={16} />
    case 'date':
      return <IconCalendar size={16} />
    case 'date-range':
      return <IconCalendarTime size={16} />
    case 'bool':
      return <IconSquareCheck size={16} />
    case 'select':
      return <IconListCheck size={16} />
  }
}
interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string
  type: string
}

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ type, label, ...others }: ItemProps, ref) => (
  <div ref={ref} {...others}>
    <Group noWrap>
      {getSchemasIcon(type)}
      <Text size="sm">{label}</Text>
    </Group>
  </div>
))
