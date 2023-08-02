<script lang="ts">
	import { rlsModal } from '$lib/store/modal'
	import { Modal } from 'flowbite-svelte'
	import RLS from './RLS.svelte'
</script>

<Modal bind:open={$rlsModal.open} class="w-full" title="rls" placement="top-center" size="lg">
	<RLS />
</Modal>
