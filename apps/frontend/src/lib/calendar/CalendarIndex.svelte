<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import type { ICalendarField, IFieldType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import CalendarConfig from './CalendarConfig.svelte'
	import * as Card from '$lib/components/ui/card'
	import DateCalendarView from './DateCalendarView.svelte'
	import DateRangeCalendarView from './DateRangeCalendarView.svelte'

	const table = getTable()
	const view = getView()

	$: fieldId = $view.calendarFieldIdString
	$: field = fieldId ? ($table.schema.getFieldById(fieldId).into() as ICalendarField | undefined) : undefined

	const map: Partial<Record<IFieldType, ComponentType>> = {
		date: DateCalendarView,
		'date-range': DateRangeCalendarView,
	}
</script>

{#if field}
	<div class="h-full">
		<svelte:component this={map[field.type]} {field} />
	</div>
{:else}
	<div class="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-slate-800/80">
		<Card.Root class="w-96">
			<Card.Header>
				<CalendarConfig />
			</Card.Header>
		</Card.Root>
	</div>
{/if}
