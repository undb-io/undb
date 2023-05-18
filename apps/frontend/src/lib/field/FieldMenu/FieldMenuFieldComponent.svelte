<script lang="ts">
	import type { Field, IFieldType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import Reference from './Reference.svelte'

	export let field: Field | null

	const map: Partial<Record<IFieldType, ComponentType>> = {
		reference: Reference,
	}
</script>

{#if field}
	<svelte:component this={map[field.type]} {field} {...$$restProps} />
{/if}
