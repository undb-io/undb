<script>
	import { createRecordOpen } from '$lib/store/modal'
	import { P, Button } from 'flowbite-svelte'
</script>

<div class="flex-1 w-full flex flex-col gap-4 items-center justify-center content-center">
	<P weight="bold">Create New Record</P>

	<Button on:click={() => createRecordOpen.set(true)} class="w-[250px]">Create New Record</Button>
</div>
