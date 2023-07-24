<script lang="ts">
	import type { IBaseFieldEventSchema } from '@undb/core'
	import { format, parseISO } from 'date-fns'

	export let field: IBaseFieldEventSchema & { format: string; timeFormat: string }
	export let previousValue: string | undefined
	export let value: string | undefined

	$: formatString = field.timeFormat ? field.format + ' ' + field.timeFormat : field.format
</script>

<div class="flex items-center gap-2 text-sm">
	{#if previousValue}
		<span class="line-through rounded-sm p-0.5 bg-red-200/50 border-red-200">
			{format(parseISO(previousValue), formatString)}
		</span>
	{/if}
	{#if value}
		<span class="rounded-sm p-0.5 bg-green-200/50 border-green-200">
			{format(parseISO(value), formatString)}
		</span>
	{/if}
</div>
