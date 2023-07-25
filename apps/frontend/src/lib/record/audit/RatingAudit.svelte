<script lang="ts">
	import RatingComponent from '$lib/cell/CellComponents/RatingComponent.svelte'
	import type { IBaseFieldEventSchema } from '@undb/core'

	export let field: IBaseFieldEventSchema & { max: number }
	export let previousValue: number | undefined
	export let value: number | undefined
</script>

<div class="flex items-center gap-2 text-sm">
	{#if previousValue}
		<span class="line-through rounded-sm p-0.5 bg-red-200/50 border-red-200">
			<RatingComponent value={previousValue} max={field.max} />
		</span>
	{/if}
	{#if value}
		<span class="rounded-sm p-0.5 bg-green-200/50 border-green-200">
			<RatingComponent {value} max={field.max} />
		</span>
	{/if}
</div>
