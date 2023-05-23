<script lang="ts">
	import type { CurrencyField, CurrencyFieldValue } from '@undb/core'

	export let value: CurrencyFieldValue | undefined
	export let field: CurrencyField

	$: currency = value?.unpack() ?? 0
</script>

<div class="flex items-center gap-2">
	<span>{field.symbol.symbol}</span>
	<span>{currency}</span>
</div>
