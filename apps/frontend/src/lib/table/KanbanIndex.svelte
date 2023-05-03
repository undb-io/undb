<script lang="ts">
	import { getView } from '$lib/store/table'
	import KanbanConfig from '$lib/view/KanbanConfig.svelte'
	import { Card } from 'flowbite-svelte'
	import KanbanView from './KanbanView.svelte'

	const view = getView()

	$: fieldId = $view.kanbanFieldIdString
</script>

{#if fieldId}
	<KanbanView {fieldId} />
{:else}
	<div class="flex items-center justify-center h-screen w-full bg-gray-100">
		<Card class="flex-1">
			<KanbanConfig />
		</Card>
	</div>
{/if}
