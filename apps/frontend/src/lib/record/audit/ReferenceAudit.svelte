<script lang="ts">
	import ReferenceComponent from '$lib/cell/CellComponents/ReferenceComponent.svelte'
	import type { IBaseFieldEventSchema, IReferenceReadableValueSchema } from '@undb/core'
	import { differenceBy } from 'lodash-es'

	export let field: IBaseFieldEventSchema
	export let previousValue: IReferenceReadableValueSchema | undefined
	export let value: IReferenceReadableValueSchema | undefined

	$: removed = differenceBy(previousValue, value ?? [], 'id')
	$: added = differenceBy(value, previousValue ?? [], 'id')
</script>

<div class="text-sm space-y-2">
	{#if removed.length}
		<div class="line-through rounded-sm p-1 bg-red-200/50 border-red-200 flex items-center flex-wrap gap-1">
			{#each removed as value}
				<ReferenceComponent value={value.value} />
			{/each}
		</div>
	{/if}
	{#if added.length}
		<div class="rounded-sm p-1 bg-green-200/50 border-green-200 flex flex-wrap gap-1 items-center">
			{#each added as v}
				<ReferenceComponent value={v.value} />
			{/each}
		</div>
	{/if}
</div>
