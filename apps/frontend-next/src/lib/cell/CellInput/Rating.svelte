<script lang="ts">
	import type { RatingField } from '@undb/core'
	import { NumberInput } from 'flowbite-svelte'
	export let value: number = 0
	export let name: string
	export let placeholder = ''
	export let field: RatingField
</script>

<NumberInput bind:value {name} {placeholder} {...$$restProps} min={0} max={field.max} />
