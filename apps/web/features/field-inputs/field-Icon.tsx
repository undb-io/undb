import {
  Icon123,
  IconBinaryTree,
  IconCalculator,
  IconCalendar,
  IconCalendarPlus,
  IconCalendarStats,
  IconCalendarTime,
  IconHierarchy,
  IconKey,
  IconLetterT,
  IconListCheck,
  IconMail,
  IconPalette,
  IconQuestionMark,
  IconRelationManyToMany,
  IconSearch,
  IconSortAscendingNumbers,
  IconSquareCheck,
  IconStars,
  IconSum,
} from '@egodb/ui'
import React from 'react'
interface FieldProps {
  type?: string
  size?: number
  color?: string
}

export const FieldIcon: React.FC<FieldProps> = ({ type, size = 16, color }) => {
  switch (type) {
    case 'id':
      return <IconKey size={size} color={color} />
    case 'string':
      return <IconLetterT size={size} color={color} />
    case 'email':
      return <IconMail size={size} color={color} />
    case 'color':
      return <IconPalette size={size} color={color} />
    case 'number':
      return <Icon123 size={size} color={color} />
    case 'rating':
      return <IconStars size={size} color={color} />
    case 'date':
      return <IconCalendar size={size} color={color} />
    case 'created-at':
      return <IconCalendarPlus size={size} color={color} />
    case 'updated-at':
      return <IconCalendarStats size={size} color={color} />
    case 'auto-increment':
      return <IconSortAscendingNumbers size={size} color={color} />
    case 'date-range':
      return <IconCalendarTime size={size} color={color} />
    case 'bool':
      return <IconSquareCheck size={size} color={color} />
    case 'select':
      return <IconListCheck size={size} color={color} />
    case 'reference':
      return <IconRelationManyToMany size={size} color={color} />
    case 'count':
      return <IconCalculator size={size} color={color} />
    case 'sum':
      return <IconSum size={size} color={color} />
    case 'tree':
      return <IconHierarchy size={size} color={color} />
    case 'parent':
      return <IconBinaryTree size={size} color={color} />
    case 'lookup':
      return <IconSearch size={size} color={color} />
    default:
      return <IconQuestionMark size={size} color={color} />
  }
}
