import { colors } from '$lib/field/helpers'
import { tt } from '$lib/i18n'
import { cn } from '$lib/utils'
import type { RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import {
	CurrencyField,
	INTERNAL_COLUMN_CREATED_BY_NAME,
	INTERNAL_COLUMN_CREATED_BY_PROFILE_NAME,
	INTERNAL_COLUMN_UPDATED_BY_NAME,
	MultiSelectField,
	Option,
	QRCodeField,
	getAnonymousCollaboratorProfile,
	isAnonymous,
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
	type Json,
	type LookupField,
	type ParentField,
	type RatingField,
	type ReferenceField,
	type SelectField,
	type TreeField,
	type UpdatedAtField,
} from '@undb/core'
import { format } from 'date-fns'
import htm from 'htm'
import { isArray, isNumber } from 'lodash-es'
import * as QRCode from 'qrcode'

type TemplateFunc = RevoGrid.CellTemplateFunc<VNode>
type HyperFunc = RevoGrid.HyperFunc<VNode>

const string: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'string') return

	const html = htm.bind(h)
	const value = props.model[props.prop] as string | undefined
	if (!value) return null
	return html`<span class="text-sm ">${value ?? ''}</span>`
}

const json: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'json') return

	const html = htm.bind(h)
	const value = props.model[props.prop] as Json | undefined
	if (!value) return null
	return html`<span class="text-sm ">${JSON.stringify(value) ?? ''}</span>`
}

const email: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'email') return

	const value = props.model[props.prop] as string | undefined
	if (!value) return null
	return h('span', { class: 'text-sm ' }, value.toString() ?? '')
}

const qrcode: TemplateFunc = (h, props) => {
	const field = props.column.field as QRCodeField
	const type = field.type as IFieldType
	if (type !== 'qrcode') return

	const html = htm.bind(h)
	if (field.data.unpack().displayRecordURL) {
		const recordId = props.model.id as string
		const id = field.id.value + '_' + recordId
		const url = window.location.origin + '/t' + '/' + props.column.table.id.value + '?r' + '=' + recordId

		QRCode.toDataURL(url, {}, (error, data) => {
			if (error !== null) return
			setTimeout(() => {
				const img = document.getElementById(id) as HTMLImageElement | null
				if (img) {
					img.src = data
				}
			}, 0)
		})
		return html`<img class="object-cover h-full m-auto" id=${id} />`
	}

	// TODO: implement
	return html`<div>hello world</div>`
}

const url: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'url') return

	const html = htm.bind(h)

	const value = props.model[props.prop] as string | undefined
	if (!value) return null

	const url = value.toString()

	return html`<a class="text-sm underline text-primary" href="${url}">${url}</a>`
}

const id: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'id') return

	const id = props.model.id as string
	return h(
		'span',
		{
			class:
				'bg-gray-200 text-gray-600 border border-gray-300 dark:border-gray-900 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-200',
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

	return h('div', { class: 'flex items-center dark:text-gray-200' }, [
		dateComponent(h, from ?? null, field.formatString, field.timeFormatString),
		from && to ? h('span', { class: 'mx-1 dark:text-gray-200' }, '-') : null,
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
	const type = props.column.field.type as IFieldType
	if (type !== 'date') return

	const value = props.model[props.prop] as string | undefined
	if (!value) return null
	const field = props.column.field as DateField
	return dateComponent(h, value ?? '', field.formatString, field.timeFormatString)
}

const collaboratorComponent = (h: HyperFunc, collaborator: ICollaboratorProfile) => {
	const html = htm.bind(h)

	return html`
		<div
			class="flex items-center space-x-2 bg-gray-200 text-gray-600 border border-gray-300 dark:border-gray-950 text-xs font-medium pr-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 h-5"
		>
			${!collaborator.avatar
				? html`
						<div
							class=${cn(
								'relative inline-flex items-center !text-white justify-center w-5 h-5 overflow-hidden rounded-full border border-gray-300',
								colors[collaborator.color],
							)}
						>
							<span class="font-medium"> ${collaborator.username?.slice(0, 2)} </span>
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
	const createdById = props.model[INTERNAL_COLUMN_CREATED_BY_NAME]
	const createdBy = isAnonymous(createdById)
		? getAnonymousCollaboratorProfile(tt)
		: (props.model[INTERNAL_COLUMN_CREATED_BY_PROFILE_NAME] as ICollaboratorProfile)

	return collaboratorComponent(h, createdBy)
}

const updatedBy: TemplateFunc = (h, props) => {
	const updatedById = props.model[INTERNAL_COLUMN_UPDATED_BY_NAME]
	const updatedBy = isAnonymous(updatedById)
		? getAnonymousCollaboratorProfile(tt)
		: (props.model.updated_by_profile as ICollaboratorProfile)

	return collaboratorComponent(h, updatedBy)
}

const n = (h: HyperFunc, n?: number | null) => {
	return h('span', {}, n?.toString() ?? '')
}

const number: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'number') return

	const number = props.model[props.prop] as number | undefined
	return n(h, number)
}

const currency: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'currency') return

	const html = htm.bind(h)
	const number = props.model[props.prop] as number | undefined
	if (!isNumber(number)) return null
	const field = props.column.field as CurrencyField
	return html`
		<div class="flex items-center gap-1 dark:text-gray-200">
			<span>${field.symbol.symbol}</span>
			<span>${number}</span>
		</div>
	`
}

const average: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'average') return

	const average = props.model[props.prop] as number | undefined
	return n(h, average)
}

const sum: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'sum') return

	const sum = props.model[props.prop] as number | undefined
	return n(h, sum)
}

const rating: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'rating') return

	const rating = props.model[props.prop] as number | undefined

	const field = props.column.field as RatingField
	const max = field.max
	const value = rating ?? 0

	return h(
		'div',
		{ class: 'flex items-center ' },
		new Array(max).fill(0).map((_, index) =>
			h('i', {
				class: cn(
					'ti ti-star-filled w-4 h-4 inline-flex items-center justify-center ',
					index < value ? ' text-yellow-400' : ' text-gray-300 dark:text-gray-500',
				),
			}),
		),
	)
}

const autoIncrement: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'auto-increment') return
	const value = props.model.auto_increment as number | undefined

	if (!value) return

	return n(h, value)
}

const bool: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'bool') return

	const value = props.model[props.prop] as boolean | undefined

	return h('input', {
		type: 'checkbox',
		class:
			'w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600',
		disabled: true,
		checked: !!value,
	})
}

const collaborator: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'collaborator') return

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
	const type = props.column.field.type as IFieldType
	if (type !== 'color') return

	const color = props.model[props.prop] as string | undefined
	if (!color) return null

	return h('div', { class: 'flex items-center space-x-2' }, [
		h('div', { class: 'w-5 h-5', style: { backgroundColor: color } }),
		h('div', {}, color ?? ''),
	])
}

const count: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'count') return

	const count = props.model[props.prop] as number | undefined
	if (!count) return null

	return n(h, count)
}

const referenceComponent = (h: HyperFunc, value: (string | null)[] = []) => {
	const content = value.filter(Boolean).toString()
	return h(
		'span',
		{
			class: cn(
				'bg-gray-200 text-gray-600 border border-gray-300 dark:border-gray-950 text-xs px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-200',
				!content && 'text-gray-400 font-normal',
			),
		},
		content || tt('unnamed', { ns: 'common' }) || '',
	)
}

const reference: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'reference' && type !== 'tree') return

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
		{ class: 'flex items-center space-x-2 text-gray-800 font-medium ' },
		values.map((value) => referenceComponent(h, value)),
	)
}

const optionComponent = (h: HyperFunc, { color, name }: IOptionSchema) => {
	const textColor = color.shade > 5 ? 'text-dark' : 'text-white'
	const c = colors[color.name]
	return h(
		'span',
		{
			class: cn(c, textColor, 'text-xs font-medium mr-2 px-2.5 py-0.5 rounded'),
		},
		name,
	)
}

const select: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'select') return

	const field = props.column.field as SelectField
	const value = props.model[props.prop] as string | undefined
	const option = value ? field.options.getById(value).into() : undefined
	if (!option) return null

	return optionComponent(h, option.toJSON())
}

const multiSelect: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'multi-select') return

	const html = htm.bind(h)
	const field = props.column.field as MultiSelectField
	const value = props.model[props.prop] as string[] | undefined
	if (!isArray(value)) return null

	const options = value
		? (value.map((optionId) => field.options.getById(optionId).into()).filter(Boolean) as Option[])
		: undefined
	if (!options) return null

	return html` <div class="flex item-centers">${options.map((option) => optionComponent(h, option.toJSON()))}</div> `
}

const parent: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'parent') return

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
	const type = props.column.field.type as IFieldType
	if (type !== 'lookup') return

	const html = htm.bind(h)
	const field = props.column.field as LookupField

	const values = field.getDisplayValues(props.model.display_values)
	return html`
		<div class="flex items-center gap-2 dark:text-gray-200">
			${values.map((value) => html` <span> ${value.toString()} </span> `)}
		</div>
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
	const type = props.column.field.type as IFieldType
	if (type !== 'attachment') return null

	const value = props.model[props.prop] as IAttachmentItem[] | undefined
	if (!value) return null

	const attachments = value
	if (!isArray(attachments)) return null

	return h(
		'div',
		{ class: 'inline-flex items-center h-full gap-2 p-1' },
		attachments.map((attachment) => attachmentItem(h, attachment)),
	)
}

const min: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'min') return

	const min = props.model[props.prop] as number | undefined
	if (!min) return null

	return n(h, min)
}

const max: TemplateFunc = (h, props) => {
	const type = props.column.field.type as IFieldType
	if (type !== 'max') return

	const max = props.model[props.prop] as number | undefined
	if (!max) return null

	return n(h, max)
}

export const cellTemplateMap: Record<IFieldType, TemplateFunc> = {
	attachment,
	'auto-increment': autoIncrement,
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
	qrcode,
	url,
	json,
	lookup,
	number,
	parent,
	rating,
	reference,
	select,
	'multi-select': multiSelect,
	string,
	sum,
	currency,
	tree: reference,
	'updated-at': updatedAt,
	'updated-by': updatedBy,
	min,
	max,
}
