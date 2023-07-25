<script lang="ts">
	import ColorComponent from '$lib/cell/CellComponents/ColorComponent.svelte'
	import type { IBaseFieldEventSchema } from '@undb/core'

	export let field: IBaseFieldEventSchema
	export let previousValue: string | undefined
	export let value: string | undefined
</script>

<div class="flex items-center gap-2 text-sm">
	{#if previousValue}
		<span class="line-through rounded-sm p-1 inline-flex items-center justify-center bg-red-200/50 border-red-200">
			<ColorComponent value={previousValue} />
		</span>
	{/if}
	{#if value}
		<span class="rounded-sm p-1 inline-flex items-center justify-center bg-green-200/50 border-green-200">
			<ColorComponent {value} />
		</span>
	{/if}
</div>
