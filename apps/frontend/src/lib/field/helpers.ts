import {
	AttachmentField,
	AutoIncrementField,
	AverageField,
	BoolField,
	ColorField,
	CountField,
	CreatedAtField,
	DateField,
	DateRangeField,
	EmailField,
	IdField,
	NumberField,
	RatingField,
	SelectField,
	StringField,
	SumField,
	TreeField,
	UpdatedAtField,
	type Field,
	type IFieldType,
} from '@undb/core'
import type { Select } from 'flowbite-svelte'

export function getFilterOperators(field: Field | undefined) {
	let data: Select['$$prop_def']['items'] = []
	if (field instanceof StringField) {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$contains', name: 'CONTAINS' },
			{ value: '$starts_with', name: 'STARTS WITH' },
			{ value: '$ends_with', name: 'ENDS WITH' },
			// { value: '$regex', name: 'REGEX',},
		]
	} else if (field instanceof EmailField) {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$contains', name: 'CONTAINS' },
			{ value: '$starts_with', name: 'STARTS WITH' },
			{ value: '$ends_with', name: 'ENDS WITH' },
		]
	} else if (field instanceof ColorField) {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
		]
	} else if (
		field instanceof NumberField ||
		field instanceof RatingField ||
		field instanceof CountField ||
		field instanceof SumField ||
		field instanceof AverageField ||
		field instanceof AutoIncrementField
	) {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$gt', name: 'GREATER THAN' },
			{ value: '$gte', name: 'GREATER THAN OR EQUAL' },
			{ value: '$lt', name: 'LESS THAN' },
			{ value: '$lte', name: 'LESS THAN OR EQUAL' },
		]
	} else if (field instanceof AttachmentField) {
		data = [
			{ value: '$is_empty', name: 'IS EMPTY' },
			{ value: '$is_not_empty', name: 'IS NOT EMPTY' },
			{ value: '$has_file_type', name: 'HAS FILE TYPE' },
			{ value: '$has_file_extension', name: 'HAS FILE EXTENSION' },
		]
	} else if (field instanceof DateField || field instanceof CreatedAtField || field instanceof UpdatedAtField) {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$gt', name: 'GREATER THAN' },
			{ value: '$gte', name: 'GREATER THAN OR EQUAL' },
			{ value: '$lt', name: 'LESS THAN' },
			{ value: '$lte', name: 'LESS THAN OR EQUAL' },
			{ value: '$is_today', name: 'IS TODAY' },
		]
	} else if (field instanceof DateRangeField) {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
		]
	} else if (field instanceof BoolField) {
		data = [
			{ value: '$is_true', name: 'IS TRUE' },
			{ value: '$is_false', name: 'IS FALSE' },
		]
	} else if (field instanceof SelectField) {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$in', name: 'IN' },
			{ value: '$nin', name: 'NOT IN' },
		]
	} else if (field instanceof TreeField) {
		data = [{ value: '$is_root', name: 'IS ROOT' }]
	} else if (field instanceof IdField) {
		data = [
			{ value: '$eq', name: 'EQUAL' },
			{ value: '$neq', name: 'NOT EQUAL' },
			{ value: '$in', name: 'IN' },
			{ value: '$nin', name: 'NOT IN' },
		]
	}

	return data
}

export const icons: Record<IFieldType, string> = {
	string: 'letter-t',
	number: '123',
	id: 'key',
	'auto-increment': 'sort-ascending-2',
	average: 'math-x-divide-2',
	bool: 'square-check',
	collaborator: 'user',
	'date-range': 'calendar-time',
	select: 'list-check',
	date: 'calendar',
	'created-at': 'calendar-plus',
	'updated-at': 'calendar-stats',
	email: 'mail',
	color: 'palette',
	reference: 'relation-many-to-many',
	tree: 'hierarchy',
	parent: 'binary-tree',
	rating: 'stars',
	count: 'calculator',
	lookup: 'search',
	sum: 'sum',
	attachment: 'paperclip',
	'created-by': 'calendar-plus',
	'updated-by': 'calendar-stats',
}

export const getIconClass = (type: IFieldType) => `ti ti-${icons[type]}`
