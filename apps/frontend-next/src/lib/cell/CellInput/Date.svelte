<script lang="ts">
	import { Input } from 'flowbite-svelte'

	export let value: any
</script>

<Input type="date" bind:value {...$$restProps} />
