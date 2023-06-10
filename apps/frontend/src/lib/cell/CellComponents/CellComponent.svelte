<script lang="ts">
	import type { Field, IFieldType, Option, RecordAllValueType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import String from './String.svelte'
	import Number from './Number.svelte'
	import Select from './Select.svelte'
	import MultiSelect from './MultiSelect.svelte'
	import Id from './Id.svelte'
	import Rating from './Rating.svelte'
	import Attachment from './Attachment.svelte'
	import Bool from './Bool.svelte'
	import Date from './Date.svelte'
	import CreatedAt from './CreatedAt.svelte'
	import UpdatedAt from './UpdatedAt.svelte'
	import Color from './Color.svelte'
	import DateRange from './DateRange.svelte'
	import Reference from './Reference.svelte'
	import Collaborator from './Collaborator.svelte'
	import Parent from './Parent.svelte'
	import Currency from './Currency.svelte'

	export let field: Field
	export let value: RecordAllValueType | Option

	const map: Record<IFieldType, ComponentType> = {
		string: String,
		number: Number,
		id: Id,
		'created-at': CreatedAt,
		'updated-at': UpdatedAt,
		'auto-increment': Number,
		color: Color,
		email: String,
		json: String,
		date: Date,
		select: Select,
		'multi-select': MultiSelect,
		bool: Bool,
		'date-range': DateRange,
		reference: Reference,
		tree: Reference,
		currency: Currency,
		parent: Parent,
		rating: Rating,
		count: Number,
		lookup: String,
		sum: Number,
		average: Number,
		attachment: Attachment,
		collaborator: Collaborator,
		'created-by': String,
		'updated-by': String,
	}
</script>

{#if value}
	<svelte:component this={map[field.type]} {value} {field} {...$$restProps} />
{/if}
