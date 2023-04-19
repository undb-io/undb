<script lang="ts">
	import { NumberInput } from 'flowbite-svelte'
	export let value: number = 0
	export let name: string
	export let placeholder = ''
</script>

<NumberInput bind:value {name} {placeholder} {...$$restProps} />
