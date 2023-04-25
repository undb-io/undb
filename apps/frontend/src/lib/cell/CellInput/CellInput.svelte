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
	import Collaborator from './Collaborator.svelte'
	import Reference from './Reference.svelte'
	import Tree from './Tree.svelte'
	import Parent from './Parent.svelte'
	import Select from './Select.svelte'

	export let field: Field
	export let value: any | undefined = undefined

	const map: Record<IFieldType, ComponentType> = {
		string: String,
		number: Number,
		id: Readonly,
		'created-at': Readonly,
		'updated-at': Readonly,
		'auto-increment': Readonly,
		color: Color,
		email: Email,
		date: Date,
		select: Select,
		bool: Checkbox,
		'date-range': DateRange,
		reference: Reference,
		tree: Tree,
		parent: Parent,
		rating: Rating,
		count: Readonly,
		lookup: Readonly,
		sum: Readonly,
		average: Readonly,
		attachment: Attachment,
		collaborator: Collaborator,
		'created-by': Readonly,
		'updated-by': Readonly,
	}
</script>

<svelte:component
	this={map[field.type]}
	name={field.id.value}
	placeholder={field.description?.value}
	bind:value
	{field}
	{...$$restProps}
/>
