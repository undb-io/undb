<script lang="ts">
	import OptionComponent from '$lib/option/OptionComponent.svelte'
	import type { IBaseFieldEventSchema, IOptionSchema, ISelectReadableValueSchema } from '@undb/core'

	export let field: IBaseFieldEventSchema & { options: IOptionSchema[] }
	export let previousValue: ISelectReadableValueSchema | undefined
	export let value: ISelectReadableValueSchema | undefined

	$: previousOption = field.options.find((o) => o.key === previousValue?.id)
	$: option = field.options.find((o) => o.key === value?.id)
</script>

<div class="text-sm space-y-2">
	{#if previousOption}
		<div class="line-through rounded-sm p-1 bg-red-200/50 border-red-200 inline-flex items-center gap-2">
			<OptionComponent name={previousOption.name} color={previousOption.color} id={previousOption.key} />
		</div>
	{/if}
	{#if option}
		<div class="rounded-sm p-1 bg-green-200/50 border-green-200 inline-flex items-center gap-2">
			<OptionComponent name={option.name} color={option.color} id={option.key} />
		</div>
	{/if}
</div>
