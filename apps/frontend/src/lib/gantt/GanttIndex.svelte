<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Card } from 'flowbite-svelte'
	import type { DateRangeField } from '@undb/core'
	import GanttConfig from './GanttConfig.svelte'

	const table = getTable()
	const view = getView()

	$: fieldId = $view.ganttFieldIdString
	$: field = fieldId ? ($table.schema.getFieldById(fieldId).into() as DateRangeField | undefined) : undefined
</script>

{#if field}
	gantt!!!
	<!-- <svelte:component this={map[field.type]} {field} /> -->
{:else}
	<div class="flex items-center justify-center h-screen w-full bg-gray-100 dark:bg-slate-800/80">
		<Card class="flex-1">
			<GanttConfig />
		</Card>
	</div>
{/if}
