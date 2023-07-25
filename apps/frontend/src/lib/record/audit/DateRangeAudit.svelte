<script lang="ts">
	import type { IBaseFieldEventSchema, IDateRangeReadableValueSchema } from '@undb/core'
	import { format, parseISO } from 'date-fns'

	export let field: IBaseFieldEventSchema & { format: string; timeFormat: string }
	export let previousValue: IDateRangeReadableValueSchema | undefined
	export let value: IDateRangeReadableValueSchema | undefined

	$: formatString = field.timeFormat ? field.format + ' ' + field.timeFormat : field.format
</script>

<div class="text-sm space-y-2">
	{#if previousValue}
		<div class="line-through rounded-sm p-0.5 bg-red-200/50 border-red-200 flex items-center gap-2">
			<span>
				{#if previousValue[0]}
					{format(parseISO(previousValue[0]), formatString)}
				{:else}
					null
				{/if}
			</span>
			<span>-</span>
			<span>
				{#if previousValue[1]}
					{format(parseISO(previousValue[1]), formatString)}
				{:else}
					null
				{/if}
			</span>
		</div>
	{/if}
	{#if value}
		<div class="rounded-sm p-0.5 bg-green-200/50 border-green-200 flex items-center gap-2">
			<span>
				{#if value[0]}
					{format(parseISO(value[0]), formatString)}
				{:else}
					null
				{/if}
			</span>
			<span>-</span>
			<span>
				{#if value[1]}
					{format(parseISO(value[1]), formatString)}
				{:else}
					null
				{/if}
			</span>
		</div>
	{/if}
</div>
