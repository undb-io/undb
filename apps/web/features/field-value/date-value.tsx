import type { DateFieldTypes } from '@egodb/core'
import { format } from 'date-fns/fp'

interface IProps {
  field: DateFieldTypes
  value: Date | undefined
}

export const DateValue: React.FC<IProps> = ({ field, value }) => {
  if (!value) return null

  const dateTimeFormat = format(field.formatString)

  return <>{dateTimeFormat(value)}</>
}
