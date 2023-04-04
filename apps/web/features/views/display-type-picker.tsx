import type { IViewDisplayType } from '@egodb/core'
import type { SelectProps } from '@egodb/ui'
import { Text } from '@egodb/ui'
import { ActionIcon, Group } from '@egodb/ui'
import { Select } from '@egodb/ui'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { displayTypes } from '../view/display-type'
import { DisplayTypeIcon, getDisplayTypeColor } from '../view/display-type-icon'

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: IViewDisplayType
  label: string
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, value, ...others }: ItemProps, ref) => {
  const { t } = useTranslation()
  return (
    <Group ref={ref} p="xs" {...others}>
      <ActionIcon bg={getDisplayTypeColor(value)} size="sm">
        <DisplayTypeIcon displayType={value} size={18} color="white" />
      </ActionIcon>
      <Text>{t(label)}</Text>
    </Group>
  )
})

export const DisplayTypePicker: React.FC<Omit<SelectProps, 'data'>> = (props) => {
  const { t } = useTranslation()

  return (
    <Select
      icon={<DisplayTypeIcon displayType={props.value as IViewDisplayType} />}
      data={displayTypes.map((v) => ({ value: v.value, label: t(v.label) as string }))}
      {...props}
      itemComponent={SelectItem}
      withinPortal
    />
  )
}
