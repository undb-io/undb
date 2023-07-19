import type { IColor, IFieldType } from '@undb/core'

export function getFilterOperators(type: IFieldType | undefined): {
	name: string
	value: string
}[] {
	let data: {
		name: string
		value: string
	}[] = []
	if (type === 'string') {
		data = [
			{ value: '$is_empty', name: 'IS EMPTY' },
			{ value: '$is_not_empty', name: 'IS NOT EMPTY' },
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$contains', name: 'CONTAINS' },
			{ value: '$starts_with', name: 'STARTS WITH' },
			{ value: '$ends_with', name: 'ENDS WITH' },
			// { value: '$regex', name: 'REGEX',},
		]
	} else if (type === 'email' || type === 'url') {
		data = [
			{ value: '$is_empty', name: 'IS EMPTY' },
			{ value: '$is_not_empty', name: 'IS NOT EMPTY' },
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$contains', name: 'CONTAINS' },
			{ value: '$starts_with', name: 'STARTS WITH' },
			{ value: '$ends_with', name: 'ENDS WITH' },
		]
	} else if (type === 'color') {
		data = [
			{ value: '$is_empty', name: 'IS EMPTY' },
			{ value: '$is_not_empty', name: 'IS NOT EMPTY' },
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
		]
	} else if (type === 'json') {
		data = [
			{ value: '$is_empty', name: 'IS EMPTY' },
			{ value: '$is_not_empty', name: 'IS NOT EMPTY' },
		]
	} else if (
		type === 'number' ||
		type === 'rating' ||
		type === 'currency' ||
		type === 'count' ||
		type === 'min' ||
		type === 'max' ||
		type === 'sum' ||
		type === 'average' ||
		type === 'auto-increment'
	) {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$gt', name: 'GREATER THAN' },
			{ value: '$gte', name: 'GREATER THAN OR EQUAL' },
			{ value: '$lt', name: 'LESS THAN' },
			{ value: '$lte', name: 'LESS THAN OR EQUAL' },
		]
	} else if (type === 'attachment') {
		data = [
			{ value: '$is_empty', name: 'IS EMPTY' },
			{ value: '$is_not_empty', name: 'IS NOT EMPTY' },
			{ value: '$has_file_type', name: 'HAS FILE TYPE' },
			{ value: '$has_file_extension', name: 'HAS FILE EXTENSION' },
		]
	} else if (type === 'date' || type === 'created-at' || type === 'updated-at') {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$gt', name: 'GREATER THAN' },
			{ value: '$gte', name: 'GREATER THAN OR EQUAL' },
			{ value: '$lt', name: 'LESS THAN' },
			{ value: '$lte', name: 'LESS THAN OR EQUAL' },
			{ value: '$is_today', name: 'IS TODAY' },
		]
	} else if (type === 'date-range') {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$between', name: 'BETWEEN' },
			{ value: '$is_empty', name: 'IS EMPTY' },
			{ value: '$is_not_empty', name: 'IS NOT EMPTY' },
		]
	} else if (type === 'bool') {
		data = [
			{ value: '$is_true', name: 'IS TRUE' },
			{ value: '$is_false', name: 'IS FALSE' },
		]
	} else if (type === 'select') {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$in', name: 'IN' },
			{ value: '$nin', name: 'NOT IN' },
		]
	} else if (type === 'multi-select') {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$in', name: 'IN' },
			{ value: '$nin', name: 'NOT IN' },
			{ value: '$is_empty', name: 'IS EMPTY' },
			{ value: '$is_not_empty', name: 'IS NOT EMPTY' },
		]
	} else if (type === 'tree') {
		data = [{ value: '$is_root', name: 'IS ROOT' }]
	} else if (type === 'id') {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$in', name: 'IN' },
			{ value: '$nin', name: 'NOT IN' },
		]
	} else if (type === 'collaborator') {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$is_empty', name: 'IS EMPTY' },
			{ value: '$is_not_empty', name: 'IS NOT EMPTY' },
		]
	} else if (type === 'created-by' || type === 'updated-by') {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
		]
	}

	return data
}

export const icons: Record<IFieldType, string> = {
	string: 'circle-letter-a',
	number: '123',
	id: 'key',
	'auto-increment': 'sort-ascending-2',
	average: 'math-x-divide-2',
	bool: 'square-check',
	collaborator: 'user',
	'date-range': 'calendar-time',
	select: 'list',
	'multi-select': 'list-check',
	date: 'calendar',
	'created-at': 'calendar-plus',
	'updated-at': 'calendar-stats',
	email: 'mail',
	url: 'link',
	json: 'json',
	color: 'palette',
	reference: 'relation-many-to-many',
	tree: 'hierarchy',
	parent: 'binary-tree',
	rating: 'stars',
	currency: 'currency-yuan',
	count: 'calculator',
	lookup: 'search',
	sum: 'sum',
	attachment: 'paperclip',
	min: 'arrow-down',
	max: 'arrow-up',
	'created-by': 'calendar-plus',
	'updated-by': 'calendar-stats',
}

export const getIconClass = (type: IFieldType) => `ti ti-${icons[type]}`

export const colors: Record<IColor, string> = {
	slate: 'bg-slate-500',
	gray: 'bg-gray-500',
	zinc: 'bg-zinc-500',
	neutral: 'bg-neutral-500',
	stone: 'bg-stone-500',
	red: 'bg-red-500',
	orange: 'bg-orange-500',
	amber: 'bg-amber-500',
	yellow: 'bg-yellow-500',
	lime: 'bg-lime-500',
	green: 'bg-green-500',
	emerald: 'bg-emerald-500',
	teal: 'bg-teal-500',
	cyan: 'bg-cyan-500',
	sky: 'bg-sky-500',
	blue: 'bg-blue-500',
	indigo: 'bg-indigo-500',
	violet: 'bg-violet-500',
	purple: 'bg-purple-500',
	fuchsia: 'bg-fuchsia-500',
	pink: 'bg-pink-500',
	rose: 'bg-rose-500',
}
