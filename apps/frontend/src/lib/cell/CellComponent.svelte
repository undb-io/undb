<script lang="ts">
	import type { Field, IFieldType, Option, RecordAllValueType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import String from './String.svelte'
	import Number from './Number.svelte'
	import Select from './Select.svelte'
	import Id from './Id.svelte'
	import Rating from './Rating.svelte'
	import Attachment from './Attachment.svelte'
	import Bool from './Bool.svelte'

	export let field: Field
	export let value: RecordAllValueType | Option

	const map: Record<IFieldType, ComponentType> = {
		string: String,
		number: Number,
		id: Id,
		'created-at': String,
		'updated-at': String,
		'auto-increment': String,
		color: String,
		email: String,
		date: String,
		select: Select,
		bool: Bool,
		'date-range': String,
		reference: String,
		tree: String,
		parent: String,
		rating: Rating,
		count: String,
		lookup: String,
		sum: String,
		average: String,
		attachment: Attachment,
		collaborator: String,
		'created-by': String,
		'updated-by': String,
	}
</script>

{#if value}
	<svelte:component this={map[field.type]} {value} {field} {...$$restProps} />
{/if}
