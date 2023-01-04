import type { Field, Table } from '@egodb/core'
import {
  Group,
  Icon123,
  IconCalendar,
  IconCalendarTime,
  IconLetterT,
  IconListCheck,
  IconQuestionMark,
  IconSquareCheck,
} from '@egodb/ui'
import React from 'react'
interface FieldProps {
  type: string
  size?: number
}

export const getSchemasIcon: React.FC<FieldProps> = ({ type, size = 16 }) => {
  switch (type) {
    case 'string':
      return <IconLetterT size={size} />
    case 'number':
      return <Icon123 size={size} />
    case 'date':
      return <IconCalendar size={size} />
    case 'date-range':
      return <IconCalendarTime size={size} />
    case 'bool':
      return <IconSquareCheck size={size} />
    case 'select':
      return <IconListCheck size={size} />
    default:
      return <IconQuestionMark size={size} />
  }
}
