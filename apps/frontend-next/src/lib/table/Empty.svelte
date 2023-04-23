<script>
	import { createTableOpen } from '$lib/store/modal'
	import { P, Button } from 'flowbite-svelte'
</script>

<div class="h-full w-full flex flex-col gap-4 items-center justify-center content-center">
	<P weight="bold">Create New Table</P>

	<Button class="w-[250px]" on:click={() => createTableOpen.set(true)}>Create New Table</Button>
</div>
