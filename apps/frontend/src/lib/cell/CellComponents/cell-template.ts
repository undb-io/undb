import { colors } from '$lib/field/helpers'
import { tt } from '$lib/i18n'
import type { RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import {
	isImage,
	type CollaboratorField,
	type CreatedAtField,
	type DateField,
	type DateRangeField,
	type IAttachmentItem,
	type ICollaboratorProfile,
	type IColor,
	type IDateRangeFieldQueryValue,
	type IFieldType,
	type IOptionSchema,
	type LookupField,
	type ParentField,
	type RatingField,
	type ReferenceField,
	type SelectField,
	type TreeField,
	type UpdatedAtField,
} from '@undb/core'
import cx from 'classnames'
import { format } from 'date-fns'
import htm from 'htm'

type TemplateFunc = RevoGrid.CellTemplateFunc<VNode>
type HyperFunc = RevoGrid.HyperFunc<VNode>

const string: TemplateFunc = (h, props) => {
	const html = htm.bind(h)
	const value = props.model[props.prop] as string | undefined
	if (!value) return null
	return html`<span class="text-sm">${value ?? ''}</span>`
}

const email: TemplateFunc = (h, props) => {
	const value = props.model[props.prop] as string | undefined
	if (!value) return null
	return h('span', { class: 'text-sm' }, value.toString() ?? '')
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

const dateComponent = (
	h: HyperFunc,
	dateString: string | null,
	dateFormatString: string,
	timeFormatString?: string | null,
) => {
	if (!dateString) return null
	const date = new Date(dateString)
	const formatString = timeFormatString ? dateFormatString + ' ' + timeFormatString : dateFormatString
	return h('span', {}, format(date, formatString))
}

const dateRange: TemplateFunc = (h, props) => {
	const value = props.model[props.prop] as IDateRangeFieldQueryValue | undefined
	if (!value) return null

	const field = props.column.field as DateRangeField

	const [from, to] = value

	return h('div', { class: 'flex items-center' }, [
		dateComponent(h, from ?? null, field.formatString, field.timeFormatString),
		from && to ? h('span', { class: 'mx-1' }, '-') : null,
		dateComponent(h, to ?? null, field.formatString, field.timeFormatString),
	])
}

const createdAt: TemplateFunc = (h, props) => {
	const createdAt = props.model.created_at as string
	const field = props.column.field as CreatedAtField
	return dateComponent(h, createdAt, field.formatString, field.timeFormatString)
}

const updatedAt: TemplateFunc = (h, props) => {
	const updatedAt = props.model.updated_at as string
	const field = props.column.field as UpdatedAtField
	return dateComponent(h, updatedAt, field.formatString, field.timeFormatString)
}

const date: TemplateFunc = (h, props) => {
	const value = props.model[props.prop] as string | undefined
	if (!value) return null
	const field = props.column.field as DateField
	return dateComponent(h, value ?? '', field.formatString, field.timeFormatString)
}

const collaboratorComponent = (h: HyperFunc, collaborator: ICollaboratorProfile) => {
	const html = htm.bind(h)

	return html`
		<div
			class="flex items-center space-x-2 bg-gray-100 text-gray-800 text-xs font-medium pr-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 h-5"
		>
			${!collaborator.avatar
				? html`
						<div
							class=${cx(
								'relative inline-flex items-center !text-white justify-center w-5 h-5 overflow-hidden rounded-full border border-gray-300',
								colors[collaborator.color],
							)}
						>
							<span class="font-medium"> ${collaborator.username.slice(0, 2)} </span>
						</div>
				  `
				: html` <img class="w-5 h-5 rounded-full" src="${collaborator.avatar}" alt="${collaborator.username}" /> `}
			<div class="font-medium dark:text-white">
				<span>${collaborator.username}</span>
			</div>
		</div>
	`
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
	const number = props.model[props.prop] as number | undefined
	return n(h, number)
}

const average: TemplateFunc = (h, props) => {
	const average = props.model[props.prop] as number | undefined
	return n(h, average)
}

const sum: TemplateFunc = (h, props) => {
	const sum = props.model[props.prop] as number | undefined
	return n(h, sum)
}

const rating: TemplateFunc = (h, props) => {
	const rating = props.model[props.prop] as number | undefined

	const field = props.column.field as RatingField
	const max = field.max
	const value = rating ?? 0

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
	const value = props.model[props.prop] as boolean | undefined

	return h('input', {
		type: 'checkbox',
		class:
			'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600',
		disabled: true,
		checked: !!value,
	})
}

const collaborator: TemplateFunc = (h, props) => {
	const html = htm.bind(h)
	const collaborator = props.model[props.prop] as string[] | undefined
	if (!collaborator) return null
	const field = props.column.field as CollaboratorField

	const value = field.getDisplayValues(props.model.display_values)

	return html`
		<div class="flex items-center space-x-2">
			${value.map(([username, avatar, color]) => {
				if (!username) return null
				return collaboratorComponent(h, { username, avatar, color: color as IColor })
			})}
		</div>
	`
}

const color: TemplateFunc = (h, props) => {
	const color = props.model[props.prop] as string | undefined
	if (!color) return null

	return h('div', { class: 'flex items-center space-x-2' }, [
		h('div', { class: 'w-5 h-5', style: { backgroundColor: color } }),
		h('div', {}, color ?? ''),
	])
}

const count: TemplateFunc = (h, props) => {
	const count = props.model[props.prop] as number | undefined
	if (!count) return null

	return n(h, count)
}

const referenceComponent = (h: HyperFunc, value: (string | null)[] = []) => {
	const content = value.filter(Boolean).toString()
	return h(
		'span',
		{
			class: cx('bg-gray-100 text-xs mr-2 px-2.5 py-0.5 rounded', !content && 'text-gray-400 font-normal'),
		},
		content || tt('unamed', { ns: 'common' }) || '',
	)
}

const reference: TemplateFunc = (h, props) => {
	const unpacked = props.model[props.prop] as string[] | undefined
	if (!unpacked?.length) return null
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
	const value = props.model[props.prop] as string | undefined
	const option = value ? field.options.getById(value).into() : undefined
	if (!option) return null

	return optionComponent(h, option.toJSON())
}

const parent: TemplateFunc = (h, props) => {
	const unpacked = props.model[props.prop] as string | undefined
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
	const html = htm.bind(h)
	const field = props.column.field as LookupField

	const values = field.getDisplayValues(props.model.display_values)
	return html`
		<div class="flex items-center gap-2">${values.map((value) => html` <span> ${value.toString()} </span> `)}</div>
	`
}

const attachmentItem = (h: HyperFunc, attachment: IAttachmentItem) => {
	const img = isImage(attachment)
	if (img) {
		return h('img', { class: 'object-cover w-full h-auto', src: attachment.url, alt: attachment.name })
	}

	// TODO: render file icon
	return h('span', {}, attachment.name)
}

const attachment: TemplateFunc = (h, props) => {
	const value = props.model[props.prop] as IAttachmentItem[] | undefined
	if (!value) return null

	const attachments = value

	return h(
		'div',
		{ class: 'inline-flex items-center h-full gap-2 p-1' },
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
