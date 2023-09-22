<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import KanbanConfig from '$lib/view/KanbanConfig.svelte'
	import SelectKanbanView from './SelectKanbanView.svelte'
	import DateKanbanView from './DateKanbanView.svelte'
	import type { DateField, IFieldType, SelectField } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import * as Card from '$lib/components/ui/card'

	const table = getTable()
	const view = getView()

	$: fieldId = $view.kanbanFieldIdString
	$: field = fieldId ? ($table.schema.getFieldById(fieldId).into() as SelectField | DateField | undefined) : undefined

	const map: Partial<Record<IFieldType, ComponentType>> = {
		select: SelectKanbanView,
		date: DateKanbanView,
	}
</script>

{#if field}
	<div class="h-full overflow-hidden">
		<svelte:component this={map[field.type]} {field} />
	</div>
{:else}
	<div class="flex items-center h-full justify-center w-full bg-gray-100 dark:bg-slate-800/80">
		<Card.Root class="w-96">
			<Card.Header>
				<KanbanConfig />
			</Card.Header>
		</Card.Root>
	</div>
{/if}
