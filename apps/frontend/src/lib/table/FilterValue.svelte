<script lang="ts">
	import String from '$lib/cell/CellInput/String.svelte'
	import type { Field, IFieldType } from '@undb/core'
	import { Input } from 'flowbite-svelte'
	import type { ComponentType } from 'svelte'

	export let field: Field | undefined
	export let operator: string | undefined
	export let value: any

	let component: ComponentType | undefined

	$: type = field?.type

	const map: Partial<Record<IFieldType, ComponentType>> = {
		string: String,
	}

	$: component = field && type ? map[type] ?? Input : Input
</script>

<svelte:component this={component} bind:value {field} {...$$restProps} disabled={!field} />
