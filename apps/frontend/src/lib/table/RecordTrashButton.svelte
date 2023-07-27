<script lang="ts">
	import { recordTrashModal } from '$lib/store/modal'
	import { Button } from 'flowbite-svelte'
</script>

<Button color="alternative" size="xs" on:click={() => recordTrashModal.open()}>
	<i class="ti ti-trash"></i>
</Button>
