import { addDays, startOfDay } from 'date-fns'
import { NODATE_STACK_ID } from './kanban.constants'

export const KANBAN_DATE_STACKS = [
  NODATE_STACK_ID,
  'BEFORE_YESTERDAY',
  'YESTERDAY',
  'TODAY',
  'TOMORROW',
  'AFTER_TOMORROW',
] as const

export const RElAVANT_DATES = ['BEFORE_YESTERDAY', 'AFTER_TOMORROW'] as const

export const getDateValue = (id: (typeof KANBAN_DATE_STACKS)[number]) => {
  if (id === NODATE_STACK_ID) return null
  if (id === 'TODAY') return startOfDay(new Date())
  if (id === 'YESTERDAY') return startOfDay(addDays(new Date(), -1))
  if (id === 'TOMORROW') return startOfDay(addDays(new Date(), 1))
  return null
}
