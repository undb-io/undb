<script lang="ts">
	import { formEditorModal } from '$lib/store/modal'
	import { Modal } from 'flowbite-svelte'
	import FormEditor from './FormEditor.svelte'
	import { selectedForm } from '$lib/store/drawer'
</script>

{#if $selectedForm}
	<Modal
		class="w-full"
		title={$selectedForm.name.value}
		size="lg"
		placement="top-center"
		bind:open={$formEditorModal.open}
	>
		<FormEditor />
	</Modal>
{/if}
