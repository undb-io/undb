<script lang="ts">
	import type { SelectField, SelectFieldValue } from '@undb/core'
	import Option from '$lib/option/Option.svelte'

	export let field: SelectField
	export let value: SelectFieldValue | undefined

	$: option = value?.getOption(field).into()
</script>

{#if option}
	<Option {option} />
{/if}
