<script lang="ts">
	import { mergeDataModal } from '$lib/store/modal'
	import { Modal } from 'flowbite-svelte'
</script>

<Modal class="w-full" bind:open={$mergeDataModal.open}>merge</Modal>
