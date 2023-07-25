<script lang="ts">
	import type { MultiSelectField, MultiSelectFieldValue } from '@undb/core'
	import Option from '$lib/option/Option.svelte'

	export let value: MultiSelectFieldValue | undefined
	export let field: MultiSelectField

	$: options = value?.getOptions(field) ?? []
</script>

{#each options as option}
	<Option {option} />
{/each}
