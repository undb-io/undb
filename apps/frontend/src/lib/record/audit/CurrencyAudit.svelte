<script lang="ts">
	import CurrencyComponent from '$lib/cell/CellComponents/CurrencyComponent.svelte'
	import type { IBaseFieldEventSchema, ICurrencyReadableValueSchema } from '@undb/core'

	export let field: IBaseFieldEventSchema & { symbol: string }
	export let previousValue: ICurrencyReadableValueSchema | undefined
	export let value: ICurrencyReadableValueSchema | undefined
</script>

<div class="flex items-center gap-2 text-xs">
	<span class="line-through rounded-sm p-0.5 bg-red-200/50 border-red-200">
		<CurrencyComponent value={previousValue} symbol={field.symbol} />
	</span>
	<span class="rounded-sm p-0.5 bg-green-200/50 border-green-200">
		<CurrencyComponent {value} symbol={field.symbol} />
	</span>
</div>
