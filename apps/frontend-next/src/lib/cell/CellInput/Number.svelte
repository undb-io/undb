<script lang="ts">
	import { NumberInput } from 'flowbite-svelte'
	export let value: number = 0
</script>

<NumberInput bind:value {...$$restProps} />
