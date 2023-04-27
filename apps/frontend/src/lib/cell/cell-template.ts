import { colors } from '$lib/field/helpers'
import type { RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import {
	isImage,
	type AttachmentFieldValue,
	type AverageFieldValue,
	type BoolFieldValue,
	type CollaboratorField,
	type CollaboratorFieldValue,
	type ColorFieldValue,
	type CountFieldValue,
	type CreatedAtField,
	type DateField,
	type DateFieldValue,
	type DateRangeField,
	type DateRangeFieldValue,
	type EmailFieldValue,
	type IAttachmentItem,
	type ICollaboratorProfile,
	type IFieldType,
	type IOptionSchema,
	type LookupField,
	type NumberFieldValue,
	type ParentField,
	type ParentFieldValue,
	type RatingField,
	type RatingFieldValue,
	type ReferenceField,
	type ReferenceFieldValue,
	type SelectField,
	type SelectFieldValue,
	type StringFieldValue,
	type SumFieldValue,
	type TreeField,
	type TreeFieldValue,
	type UpdatedAtField,
} from '@undb/core'
import cx from 'classnames'
import { format } from 'date-fns'

type TemplateFunc = RevoGrid.CellTemplateFunc<VNode>
type HyperFunc = RevoGrid.HyperFunc<VNode>

const string: TemplateFunc = (h, props) => {
	const value = props.model[props.prop] as StringFieldValue | undefined
	if (!value) return null
	return h('span', { class: 'text-sm' }, value.unpack()?.toString() ?? '')
}

const email: TemplateFunc = (h, props) => {
	const value = props.model[props.prop] as EmailFieldValue | undefined
	if (!value) return null
	return h('span', { class: 'text-sm' }, value.unpack()?.toString() ?? '')
}

const id: TemplateFunc = (h, props) => {
	const id = props.model.id as string
	return h(
		'span',
		{
			class:
				'bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300',
		},
		id,
	)
}

const dateComponent = (h: HyperFunc, dateString: string | null, formatString: string) => {
	if (!dateString) return null
	const date = new Date(dateString)

	return h('span', {}, format(date, formatString))
}

const dateRange: TemplateFunc = (h, props) => {
	const value = props.model[props.prop] as DateRangeFieldValue | undefined
	if (!value) return null

	const field = props.column.field as DateRangeField

	const from = value.from.into(null)?.toISOString()
	const to = value.to.into(null)?.toISOString()

	return h('div', { class: 'flex items-center' }, [
		dateComponent(h, value.from.into(null)?.toISOString() ?? null, field.formatString),
		from && to ? h('span', { class: 'mx-1' }, '-') : null,
		dateComponent(h, value.to.into(null)?.toISOString() ?? null, field.formatString),
	])
}

const createdAt: TemplateFunc = (h, props) => {
	const createdAt = props.model.created_at
	const field = props.column.field as CreatedAtField
	return dateComponent(h, createdAt, field.formatString)
}

const updatedAt: TemplateFunc = (h, props) => {
	const updatedAt = props.model.updated_at
	const field = props.column.field as UpdatedAtField
	return dateComponent(h, updatedAt, field.formatString)
}

const date: TemplateFunc = (h, props) => {
	const value = props.model[props.prop] as DateFieldValue | undefined
	if (!value || !value.unpack()) return null
	const field = props.column.field as DateField
	return dateComponent(h, value.unpack()?.toISOString() ?? '', field.formatString)
}

const collaboratorComponent = (h: HyperFunc, collaborator: ICollaboratorProfile) => {
	return h(
		'div',
		{
			class:
				'flex items-center space-x-2 bg-gray-100 text-gray-800 text-xs font-medium pr-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 h-5',
		},
		[
			!collaborator.avatar
				? h(
						'div',
						{
							class:
								'relative inline-flex items-center text-blue-900 justify-center w-5 h-5 overflow-hidden bg-indigo-100 rounded-full dark:bg-indigo-600 border border-gray-300',
						},
						h('span', { class: 'font-medium text-gray-600 dark:text-gray-300' }, collaborator.username.slice(0, 2)),
				  )
				: h('img', { class: 'w-5 h-5 rounded-full', src: collaborator.avatar, alt: collaborator.username }),
			h('div', { class: 'font-medium dark:text-white' }, h('span', {}, collaborator.username)),
		],
	)
}

const createdBy: TemplateFunc = (h, props) => {
	const createdBy = props.model.created_by_profile as ICollaboratorProfile

	return collaboratorComponent(h, createdBy)
}

const updatedBy: TemplateFunc = (h, props) => {
	const updatedBy = props.model.updated_by_profile as ICollaboratorProfile

	return collaboratorComponent(h, updatedBy)
}

const n = (h: HyperFunc, n?: number | null) => {
	return h('span', {}, n?.toString() ?? '')
}

const number: TemplateFunc = (h, props) => {
	const number = props.model[props.prop] as NumberFieldValue | undefined
	return n(h, number?.unpack())
}

const average: TemplateFunc = (h, props) => {
	const average = props.model[props.prop] as AverageFieldValue | undefined
	return n(h, average?.unpack())
}

const sum: TemplateFunc = (h, props) => {
	const sum = props.model[props.prop] as SumFieldValue | undefined
	return n(h, sum?.unpack())
}

const rating: TemplateFunc = (h, props) => {
	const rating = props.model[props.prop] as RatingFieldValue | undefined
	if (!rating) return null

	const field = props.column.field as RatingField
	const max = field.max
	const value = rating.unpack() ?? 0

	return h(
		'div',
		{ class: 'flex items-center' },
		new Array(max).fill(0).map((_, index) =>
			h('i', {
				class: cx(
					'ti ti-star-filled w-4 h-4 inline-flex items-center justify-center',
					index < value ? ' text-yellow-400' : ' text-gray-300 dark:text-gray-500',
				),
			}),
		),
	)
}

const autoIncreament: TemplateFunc = (h, props) => {
	const value = props.model.auto_increment as number | undefined

	if (!value) return

	return n(h, value)
}

const bool: TemplateFunc = (h, props) => {
	const value = props.model[props.prop] as BoolFieldValue | undefined
	if (!value) return null

	return h('input', {
		type: 'checkbox',
		class:
			'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600',
		disabled: true,
		checked: !!value.unpack(),
	})
}

const collaborator: TemplateFunc = (h, props) => {
	const collaborator = props.model[props.prop] as CollaboratorFieldValue | undefined
	if (!collaborator) return null
	const field = props.column.field as CollaboratorField

	const value = field.getDisplayValues(props.model.display_values)

	return h(
		'div',
		{ class: 'flex items-center space-x-2' },
		value.map(([username, avatar]) => {
			if (!username) return null
			return collaboratorComponent(h, { username, avatar })
		}),
	)
}

const color: TemplateFunc = (h, props) => {
	const color = props.model[props.prop] as ColorFieldValue | undefined
	if (!color) return null

	return h('div', { class: 'flex items-center space-x-2' }, [
		h('div', { class: 'w-5 h-5', style: { backgroundColor: color.unpack() } }),
		h('div', {}, color.unpack() ?? ''),
	])
}

const count: TemplateFunc = (h, props) => {
	const count = props.model[props.prop] as CountFieldValue | undefined
	if (!count) return null

	return n(h, count.unpack())
}

const referenceComponent = (h: HyperFunc, value: (string | null)[] = []) => {
	const content = value.filter(Boolean).toString()
	return h(
		'span',
		{
			class: cx('bg-gray-100 text-xs mr-2 px-2.5 py-0.5 rounded', !content && 'text-gray-400 font-normal'),
		},
		content || 'unnamed',
	)
}

const reference: TemplateFunc = (h, props) => {
	const unpacked = (props.model[props.prop] as ReferenceFieldValue | TreeFieldValue | undefined)?.unpack()
	if (!unpacked) return null
	const displayValues = props.model.display_values
	const field = props.column.field as ReferenceField | TreeField
	const values = field.getDisplayValues(displayValues)

	if (unpacked?.length && !values?.length) {
		return h(
			'div',
			{ class: 'flex items-center space-x-2 text-gray-400 font-light' },
			unpacked.map(() => referenceComponent(h, [null])),
		)
	}
	return h(
		'div',
		{ class: 'flex items-center space-x-2 text-gray-800  dark:bg-gray-700 dark:text-gray-300 font-medium ' },
		values.map((value) => referenceComponent(h, value)),
	)
}

const optionComponent = (h: HyperFunc, { color, name }: IOptionSchema) => {
	const textColor = color.shade > 5 ? 'text-dark' : 'text-white'
	const c = colors[color.name]
	return h(
		'span',
		{
			class: cx(c, textColor, 'text-xs font-medium mr-2 px-2.5 py-0.5 rounded'),
		},
		name,
	)
}

const select: TemplateFunc = (h, props) => {
	const field = props.column.field as SelectField
	const option = (props.model[props.prop] as SelectFieldValue | undefined)?.getOption(field).into()
	if (!option) return null

	return optionComponent(h, option.toJSON())
}

const parent: TemplateFunc = (h, props) => {
	const unpacked = (props.model[props.prop] as ParentFieldValue | undefined)?.unpack()
	if (!unpacked) return null
	const field = props.column.field as ParentField
	const value = field.getDisplayValues(props.model.display_values)[0]

	if (!value) {
		if (unpacked) {
			return referenceComponent(h, [null])
		}
		return null
	}

	return referenceComponent(h, value)
}

const lookup: TemplateFunc = (h, props) => {
	const field = props.column.field as LookupField

	const values = field.getDisplayValues(props.model.display_values)
	return h(
		'div',
		{ class: 'flex items-center' },
		values.map((value) => h('span', {}, value.toString())),
	)
}

const attachmentItem = (h: HyperFunc, attachment: IAttachmentItem) => {
	const img = isImage(attachment)
	if (img) {
		return h('img', { src: `/public/${attachment.token}_${attachment.name}`, alt: attachment.name })
	}

	// TODO: render file icon
	return h('span', {}, attachment.name)
}

const attachment: TemplateFunc = (h, props) => {
	const value = props.model[props.prop] as AttachmentFieldValue | undefined
	if (!value) return null

	const attachments = value.unpack()

	return h(
		'div',
		{ class: 'inline-flex h-full gap-2 p-1' },
		attachments.map((attachment) => attachmentItem(h, attachment)),
	)
}

export const cellTemplateMap: Record<IFieldType, TemplateFunc> = {
	attachment,
	'auto-increment': autoIncreament,
	id,
	date,
	average,
	bool,
	collaborator,
	color,
	count,
	'created-at': createdAt,
	'created-by': createdBy,
	'date-range': dateRange,
	email,
	lookup,
	number,
	parent,
	rating,
	reference,
	select,
	string,
	sum,
	tree: reference,
	'updated-at': updatedAt,
	'updated-by': updatedBy,
}
