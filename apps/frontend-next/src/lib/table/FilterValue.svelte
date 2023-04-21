<script lang="ts">
	import String from '$lib/cell/CellInput/String.svelte'
	import type { Field, IFieldType } from '@undb/core'
	import type { ComponentType } from 'svelte'

	export let field: Field
	export let operator: string
	export let value: any

	let component: ComponentType | undefined

	$: type = field.type

	const map: Partial<Record<IFieldType, ComponentType>> = {
		string: String,
	}

	$: component = map[type]
</script>

<svelte:component this={component} bind:value {field} {...$$restProps} />
