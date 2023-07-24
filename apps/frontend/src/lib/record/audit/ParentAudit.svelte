<script lang="ts">
	import ReferenceComponent from '$lib/cell/CellComponents/ReferenceComponent.svelte'
	import type { IBaseFieldEventSchema, IParentReadableValueSchema } from '@undb/core'

	export let field: IBaseFieldEventSchema
	export let previousValue: IParentReadableValueSchema | undefined
	export let value: IParentReadableValueSchema | undefined
</script>

<div class="text-sm space-y-2">
	{#if previousValue}
		<div class="line-through rounded-sm p-1 bg-red-200/50 border-red-200">
			<ReferenceComponent value={previousValue.value} />
		</div>
	{/if}
	{#if value}
		<div class="rounded-sm p-1 bg-green-200/50 border-green-200 flex flex-wrap">
			<ReferenceComponent value={value.value} />
		</div>
	{/if}
</div>
