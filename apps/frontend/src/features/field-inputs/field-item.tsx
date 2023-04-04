import { Group, Text } from '@egodb/ui'
import { forwardRef } from 'react'
import { FieldIcon } from './field-Icon'

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
  type?: string
}

export const FieldItem = forwardRef<HTMLDivElement, ItemProps>(({ value, label, type, ...others }: ItemProps, ref) => {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        <FieldIcon type={type ? type : value} />
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
})
