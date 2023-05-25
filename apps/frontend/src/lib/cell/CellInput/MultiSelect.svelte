<script lang="ts">
	import OptionsPicker from '$lib/option/OptionsPicker.svelte'
	import type { MultiSelectField } from '@undb/core'

	export let value: string[] | undefined
	export let field: MultiSelectField
</script>

<OptionsPicker {field} bind:value {...$$restProps} />
