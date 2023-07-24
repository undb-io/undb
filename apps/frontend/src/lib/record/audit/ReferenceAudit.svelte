<script lang="ts">
	import ReferenceComponent from '$lib/cell/CellComponents/ReferenceComponent.svelte'
	import type { IBaseFieldEventSchema, IReferenceReadableValueSchema } from '@undb/core'

	export let field: IBaseFieldEventSchema
	export let previousValue: IReferenceReadableValueSchema | undefined
	export let value: IReferenceReadableValueSchema | undefined
</script>

<div class="flex items-center gap-2 text-sm">
	{#if previousValue}
		<span class="line-through rounded-sm p-0.5 bg-red-200/50 border-red-200">
			{#each previousValue as value}
				<ReferenceComponent value={value.value} />
			{/each}
		</span>
	{/if}
	{#if value}
		<span class="rounded-sm p-0.5 bg-green-200/50 border-green-200">
			{#each value as v}
				<ReferenceComponent value={v.value} />
			{/each}
		</span>
	{/if}
</div>
