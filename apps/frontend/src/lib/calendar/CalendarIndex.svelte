<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Card } from 'flowbite-svelte'
	import type { ICalendarField, IFieldType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import CalendarConfig from './CalendarConfig.svelte'
	import DateCalendarView from './DateCalendarView.svelte'

	const table = getTable()
	const view = getView()

	$: fieldId = $view.calendarFieldIdString
	$: field = fieldId ? ($table.schema.getFieldById(fieldId).into() as ICalendarField | undefined) : undefined

	const map: Partial<Record<IFieldType, ComponentType>> = {
		date: DateCalendarView,
	}
</script>

{#if field}
	<svelte:component this={map[field.type]} {field} />
{:else}
	<div class="flex items-center justify-center h-screen w-full bg-gray-100">
		<Card class="flex-1">
			<CalendarConfig />
		</Card>
	</div>
{/if}
