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
	import { RecordFactory, type DateRangeField } from '@undb/core'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { createRecordInitial, createRecordOpen } from '$lib/store/modal'
	import { format } from 'date-fns'

	export let field: DateRangeField

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

	$: data = trpc().record.list.query({
		tableId: $table.id.value,
		viewId: $view.id.value,
		// filter: [
		// 	{
		// 		path: field.id.value,
		// 		type: field.type,
		// 		value: [start?.toISOString(), end?.toISOString()],
		// 		operator: '$between',
		// 	},
		// ],
	})

	$: records =
		RecordFactory.fromQueryRecords($data?.data?.records ?? [], $table.schema.toIdMap()).map((r) => r.valuesJSON) ?? []

	$: events =
		records?.map((record) => {
			const [start, end] = record[field.id.value] ?? []
			return {
				id: record.id,
				title: record.id,
				start: new Date(start),
				end: new Date(end),
			}
		}) ?? []

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
		selectable: true,
		select: (info: { start: Date; end: Date }) => {
			$createRecordInitial = {
				[field.id.value]: [format(info.start, 'yyyy-MM-dd'), format(info.end, 'yyyy-MM-dd')],
			}
			$createRecordOpen = true
		},
		eventClick: (info: { event: { id: string } }) => {
			const search = $page.url.searchParams
			$currentRecordId = info.event.id
			search.set('r', $currentRecordId!)
			goto(`?${search.toString()}`, { invalidateAll: false })
		},
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
	}
</script>

<div class="flex-1 overflow-y-auto p-4">
	<Calendar {plugins} {options} />
</div>

<style>
	:global(.ec-event.ec-preview) {
		z-index: 49;
	}
</style>
