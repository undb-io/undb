<script lang="ts">
	import type { Field, IFieldType } from '@undb/core'
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
	import OptionPicker from '$lib/option/OptionPicker.svelte'
	import Collaborator from './Collaborator.svelte'

	export let field: Field
	export let value: any | undefined = undefined

	const map: Record<IFieldType, ComponentType> = {
		string: String,
		number: Number,
		id: Readonly,
		'created-at': String,
		'updated-at': String,
		'auto-increment': Readonly,
		color: Color,
		email: Email,
		date: Date,
		select: OptionPicker,
		bool: Checkbox,
		'date-range': DateRange,
		reference: String,
		tree: String,
		parent: String,
		rating: Rating,
		count: Readonly,
		lookup: Readonly,
		sum: Readonly,
		average: Readonly,
		attachment: Attachment,
		collaborator: Collaborator,
		'created-by': String,
		'updated-by': String,
	}
</script>

<svelte:component
	this={map[field.type]}
	name={field.name}
	placeholder={field.description?.value}
	bind:value
	{field}
	{...$$restProps}
/>
