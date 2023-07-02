<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import KanbanConfig from '$lib/view/KanbanConfig.svelte'
	import { Card } from 'flowbite-svelte'
	import SelectKanbanView from './SelectKanbanView.svelte'
	import DateKanbanView from './DateKanbanView.svelte'
	import type { DateField, IFieldType, SelectField } from '@undb/core'
	import type { ComponentType } from 'svelte'

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
	<svelte:component this={map[field.type]} {field} />
{:else}
	<div class="flex items-center justify-center h-screen w-full bg-gray-100 dark:bg-slate-800/80">
		<Card class="flex-1">
			<KanbanConfig />
		</Card>
	</div>
{/if}
