<script lang="ts">
	import type { CurrencyField, CurrencyFieldValue } from '@undb/core'
	import CurrencyComponent from './CurrencyComponent.svelte'

	export let value: CurrencyFieldValue | undefined
	export let field: CurrencyField
</script>

<CurrencyComponent value={value?.unpack()} symbol={field.symbol.symbol} />
