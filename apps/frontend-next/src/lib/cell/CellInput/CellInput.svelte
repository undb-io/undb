<script lang="ts">
	import type { Field, IFieldType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import String from './String.svelte'
	import Number from './Number.svelte'
	import Select from '../Select.svelte'
	import Id from '../Id.svelte'
	import Rating from '../Rating.svelte'
	import Base from './Base.svelte'

	export let field: Field
	export let value: any | undefined = undefined

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
		bool: String,
		'date-range': String,
		reference: String,
		tree: String,
		parent: String,
		rating: Rating,
		count: String,
		lookup: String,
		sum: String,
		average: String,
		attachment: String,
		collaborator: String,
		'created-by': String,
		'updated-by': String,
	}
</script>

<Base {field} let:fieldName let:placeholder>
	<svelte:component this={map[field.type]} name={fieldName} {placeholder} bind:value {field} {...$$restProps} />
</Base>
