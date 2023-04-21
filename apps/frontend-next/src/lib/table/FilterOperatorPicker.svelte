<script lang="ts">
	import { getFilterOperators } from '$lib/field/helpers'
	import type { Field } from '@undb/core'
	import { Select } from 'flowbite-svelte'

	export let value: string = ''
	export let field: Field | undefined

	$: data = getFilterOperators(field)
</script>

<Select bind:value items={data} {...$$restProps} />
