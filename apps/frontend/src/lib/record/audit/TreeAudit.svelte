<script lang="ts">
	import ReferenceComponent from '$lib/cell/CellComponents/ReferenceComponent.svelte'
	import type { IBaseFieldEventSchema, ITreeReadableValueSchema } from '@undb/core'
	import { differenceBy } from 'lodash-es'

	export let field: IBaseFieldEventSchema
	export let previousValue: ITreeReadableValueSchema | undefined
	export let value: ITreeReadableValueSchema | undefined

	$: removed = differenceBy(previousValue, value ?? [], 'id')
	$: added = differenceBy(value, previousValue ?? [], 'id')
</script>

<div class="text-sm space-y-2">
	{#if removed.length}
		<div class="line-through rounded-sm p-1 bg-red-200/50 border-red-200">
			{#each removed as value}
				<ReferenceComponent value={value.value} />
			{/each}
		</div>
	{/if}
	{#if added.length}
		<div class="rounded-sm p-1 bg-green-200/50 border-green-200 flex flex-wrap">
			{#each added as v}
				<ReferenceComponent value={v.value} />
			{/each}
		</div>
	{/if}
</div>
