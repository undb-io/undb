<script lang="ts">
	import type { Field, IFieldType, Record } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import String from './String.svelte'
	import Number from './Number.svelte'
	import Checkbox from './Checkbox.svelte'
	import Readonly from './Readonly.svelte'
	import Rating from './Rating.svelte'
	import Date from './Date.svelte'
	import DateRange from './DateRange.svelte'
	import Color from './Color.svelte'
	import Email from './Email.svelte'
	import Attachment from './Attachment.svelte'
	import Collaborator from './Collaborator.svelte'
	import Reference from './Reference.svelte'
	import Tree from './Tree.svelte'
	import Parent from './Parent.svelte'
	import Select from './Select.svelte'
	import MultiSelect from './MultiSelect.svelte'
	import Currency from './Currency.svelte'
	import Json from './Json.svelte'
	import Url from './Url.svelte'
	import QrCode from './QRCode.svelte'

	export let field: Field
	export let record: Record | undefined = undefined
	export let value: any | undefined = undefined

	const map: globalThis.Record<IFieldType, ComponentType> = {
		string: String,
		number: Number,
		id: Readonly,
		'created-at': Readonly,
		'updated-at': Readonly,
		'auto-increment': Readonly,
		color: Color,
		email: Email,
		url: Url,
		json: Json,
		date: Date,
		select: Select,
		'multi-select': MultiSelect,
		bool: Checkbox,
		'date-range': DateRange,
		reference: Reference,
		tree: Tree,
		parent: Parent,
		rating: Rating,
		currency: Currency,
		count: Readonly,
		lookup: Readonly,
		sum: Readonly,
		average: Readonly,
		attachment: Attachment,
		collaborator: Collaborator,
		min: Readonly,
		max: Readonly,
		'created-by': Readonly,
		'updated-by': Readonly,
		qrcode: QrCode,
	}
</script>

<svelte:component
	this={map[field.type]}
	name={field.id.value}
	placeholder={field.description?.value}
	bind:value
	{field}
	{record}
	{...$$restProps}
/>
