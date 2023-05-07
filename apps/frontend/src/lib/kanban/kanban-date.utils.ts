import type { DateField, IFilters } from '@undb/core'
import { addDays, endOfDay, startOfDay } from 'date-fns'
import { NODATE_STACK_ID } from './kanban.constants'

export const KANBAN_DATE_STACKS = [
	NODATE_STACK_ID,
	'BEFORE_YESTERDAY',
	'YESTERDAY',
	'TODAY',
	'TOMORROW',
	'AFTER_TOMORROW',
] as const

export const RElAVANT_DATES = ['BEFORE_YESTERDAY', 'AFTER_TOMORROW']

export const getDateValue = (id: (typeof KANBAN_DATE_STACKS)[number]) => {
	if (id === NODATE_STACK_ID) return null
	if (id === 'TODAY') return startOfDay(new Date())
	if (id === 'YESTERDAY') return startOfDay(addDays(new Date(), -1))
	if (id === 'TOMORROW') return startOfDay(addDays(new Date(), 1))
	return null
}

export const getDateFilter = (field: DateField, id: (typeof KANBAN_DATE_STACKS)[number]): IFilters => {
	if (id === NODATE_STACK_ID)
		return [
			{
				path: field.id.value,
				type: field.type,
				value: null,
				operator: '$eq',
			},
		]
	if (id === 'TODAY')
		return [
			{
				path: field.id.value,
				type: field.type,
				value: [startOfDay(new Date()).toISOString(), endOfDay(new Date()).toISOString()],
				operator: '$between',
			},
		]
	if (id === 'YESTERDAY')
		return [
			{
				path: field.id.value,
				type: field.type,
				value: [startOfDay(addDays(new Date(), -1)).toISOString(), endOfDay(addDays(new Date(), -1)).toISOString()],
				operator: '$between',
			},
		]
	if (id === 'TOMORROW')
		return [
			{
				path: field.id.value,
				type: field.type,
				value: [startOfDay(addDays(new Date(), 1)).toISOString(), endOfDay(addDays(new Date(), 1)).toISOString()],
				operator: '$between',
			},
		]

	if (id === 'AFTER_TOMORROW') {
		return [
			{
				path: field.id.value,
				type: field.type,
				value: endOfDay(addDays(new Date(), 1)).toISOString(),
				operator: '$gt',
			},
		]
	}

	if (id === 'BEFORE_YESTERDAY') {
		return [
			{
				path: field.id.value,
				type: field.type,
				value: startOfDay(addDays(new Date(), -1)).toISOString(),
				operator: '$lt',
			},
		]
	}
	return []
}
