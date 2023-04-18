<script lang="ts">
	import type { FieldValue, IFieldType, Option } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import String from './String.svelte'
	import Number from './Number.svelte'
	import Select from './Select.svelte'
	import Id from './Id.svelte'

	export let type: IFieldType
	export let value: FieldValue | Option | undefined

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
		rating: String,
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

{#if !value}
	<span />
{:else}
	<svelte:component this={map[type]} {value} />
{/if}
