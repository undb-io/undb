<script lang="ts">
	import { currentRecordId, getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'

	// @ts-ignore
	import Calendar from '@event-calendar/core'
	// @ts-ignore
	import TimeGrid from '@event-calendar/time-grid'
	// @ts-ignore
	import DayGrid from '@event-calendar/day-grid'
	// @ts-ignore
	import Interaction from '@event-calendar/interaction'
	import { RecordFactory, type DateField } from '@undb/core'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { createRecordInitial, createRecordOpen } from '$lib/store/modal'
	import { theme } from './calendar-theme'

	export let field: DateField

	const table = getTable()
	const view = getView()

	let date = new Date()

	let start: Date | undefined
	let end: Date | undefined

	const updateRecord = trpc().record.update.mutation({
		async onSuccess(data, variables, context) {
			await $data.refetch()
		},
	})

	$: data = trpc().record.list.query(
		{
			tableId: $table.id.value,
			viewId: $view.id.value,
			filter: [
				{
					path: field.id.value,
					type: field.type,
					value: [start?.toISOString(), end?.toISOString()],
					operator: '$between',
				},
			],
		},
		{
			enabled: !!start && !!end,
		},
	)

	$: records =
		RecordFactory.fromQueryRecords($data?.data?.records ?? [], $table.schema.toIdMap()).map((r) => r.valuesJSON) ?? []
	$: events =
		records?.map((record) => ({
			id: record.id,
			title: record.id,
			start: new Date(record[field.id.value]),
			end: new Date(record[field.id.value]),
		})) ?? []

	let plugins = [TimeGrid, DayGrid, Interaction]
	$: options = {
		view: 'dayGridMonth',
		date,
		datesSet: (info: { start: Date; end: Date }) => {
			start = info.start
			end = info.end
		},
		height: '100%',
		headerToolbar: {
			start: 'prev,next today',
			center: 'title',
			end: '',
		},
		views: {
			timeGridWeek: { pointer: true },
		},
		dayMaxEvents: true,
		nowIndicator: true,
		dateClick: (info: { date: Date }) => {
			$createRecordInitial = { [field.id.value]: info.date.toISOString() }
			$createRecordOpen = true
		},
		events,
		eventClick: (info: { event: { id: string } }) => {
			const search = $page.url.searchParams
			$currentRecordId = info.event.id
			search.set('r', $currentRecordId!)
			goto(`?${search.toString()}`, { invalidateAll: false })
		},
		eventDurationEditable: false,
		eventTimeFormat: () => null,
		eventDrop: (info: { event: { id: string; start: Date; end: Date } }) => {
			$updateRecord.mutate({
				tableId: $table.id.value,
				id: info.event.id,
				values: {
					[field.id.value]: info.event.start,
				},
			})
		},
		theme,
	}
</script>

<div class="flex-1 overflow-y-auto p-4">
	<Calendar {plugins} {options} />
</div>
