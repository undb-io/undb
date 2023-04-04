import type { DateFieldTypes } from '@egodb/core'
import { Text } from '@egodb/ui'
import { format } from 'date-fns'

interface IProps {
  field: DateFieldTypes
  value: Date | undefined
}

export const DateValue: React.FC<IProps> = ({ field, value }) => {
  if (!value) return null

  return (
    <Text sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      {format(value, field.formatString)}
    </Text>
  )
}
