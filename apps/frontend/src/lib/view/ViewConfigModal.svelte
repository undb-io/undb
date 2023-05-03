<script lang="ts">
	import { getView } from '$lib/store/table'
	import type { IViewDisplayType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import { Modal } from 'flowbite-svelte'
	import { configViewOpen } from '$lib/store/modal'
	import KanbanConfig from './KanbanConfig.svelte'

	const view = getView()

	$: type = $view.displayType

	const components: Partial<Record<IViewDisplayType, ComponentType>> = {
		kanban: KanbanConfig,
	}
</script>

<Modal bind:open={$configViewOpen} placement="top-center" class="w-full">
	<div class="space-y-1">
		<svelte:component this={components[type]} slot="default" />
	</div>
</Modal>
