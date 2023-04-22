<script lang="ts">
	import type { RatingField } from '@undb/core'
	import { NumberInput } from 'flowbite-svelte'
	export let value: number = 0
	export let field: RatingField
</script>

<NumberInput bind:value {...$$restProps} min={0} max={field.max} />
