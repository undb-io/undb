<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import * as Card from '$lib/components/ui/card'
	import type { DateRangeField } from '@undb/core'
	import GanttConfig from './GanttConfig.svelte'
	import GanttView from './GanttView.svelte'

	const table = getTable()
	const view = getView()

	$: fieldId = $view.ganttFieldIdString
	$: field = fieldId ? ($table.schema.getFieldById(fieldId).into() as DateRangeField | undefined) : undefined
</script>

{#if field}
	<GanttView {field} />
{:else}
	<div class="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-slate-800/80">
		<Card.Root class="w-96">
			<Card.Header>
				<GanttConfig />
			</Card.Header>
		</Card.Root>
	</div>
{/if}
