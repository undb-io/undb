<script lang="ts">
	import OptionComponent from '$lib/option/OptionComponent.svelte'
	import type { IBaseFieldEventSchema, IMultiSelectReadableValueSchema, IOptionSchema } from '@undb/core'
	import { differenceBy } from 'lodash-es'

	export let field: IBaseFieldEventSchema & { options: IOptionSchema[] }
	export let previousValue: IMultiSelectReadableValueSchema | undefined
	export let value: IMultiSelectReadableValueSchema | undefined
	$: removed = differenceBy(previousValue, value ?? [], 'id')
	$: added = differenceBy(value, previousValue ?? [], 'id')
</script>

<div class="text-sm space-y-2">
	{#if removed?.length}
		<div class="line-through rounded-sm p-1 bg-red-200/50 border-red-200 inline-flex items-center gap-2">
			{#each removed as ro}
				{@const option = field.options.find((o) => o.key === ro.id)}
				{#if option}
					<OptionComponent name={option.name} color={option.color} id={option.key} />
				{/if}
			{/each}
		</div>
	{/if}
	{#if added?.length}
		<div class="rounded-sm p-1 bg-green-200/50 border-green-200 inline-flex items-center gap-2">
			{#each added as ro}
				{@const option = field.options.find((o) => o.key === ro.id)}
				{#if option}
					<OptionComponent name={option.name} color={option.color} id={option.key} />
				{/if}
			{/each}
		</div>
	{/if}
</div>
