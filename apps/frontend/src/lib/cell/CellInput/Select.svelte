<script lang="ts">
	import OptionPicker from '$lib/option/OptionPicker.svelte'
	import type { SelectField } from '@undb/core'

	export let value: string | undefined
	export let field: SelectField
</script>

<OptionPicker {field} bind:group={value} {...$$restProps} />
