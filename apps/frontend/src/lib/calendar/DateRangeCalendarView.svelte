<script lang="ts">
	import { currentRecordId, getTable, getView, recordHash } from '$lib/store/table'
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
	import { createRecordInitial, createRecordModal } from '$lib/store/modal'
	import { addDays, format } from 'date-fns'
	import { theme } from './calendar-theme'
	import { t } from '$lib/i18n'

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

	$: data = trpc().record.list.query(
		{
			tableId: $table.id.value,
			viewId: $view.id.value,
			filter: [
				{
					path: field.id.value,
					type: field.type,
					value: [start?.toISOString()!, end?.toISOString()!],
					operator: '$between',
				},
			],
		},
		{
			enabled: !!start && !!end,
			queryHash: $recordHash,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	)

	$: records = RecordFactory.fromQueryRecords($data?.data?.records ?? [], $table.schema.toIdMap()) ?? []

	$: events =
		records?.map((record) => {
			const values = record.valuesJSON
			const [start, end] = values[field.id.value] ?? []
			const title = record.getDisplayFieldsValue($table)
			const titleHTML = !title ? `<span class="opacity-80">${$t('unamed', { ns: 'common' })}</span>` : ''
			return {
				id: record.id.value,
				title,
				titleHTML,
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
			$createRecordInitial = { [field.id.value]: [format(info.date, 'yyyy-MM-dd'), format(info.date, 'yyyy-MM-dd')] }
			createRecordModal.open()
		},
		events,
		selectable: true,
		select: (info: { start: Date; end: Date }) => {
			$createRecordInitial = {
				[field.id.value]: [format(info.start, 'yyyy-MM-dd'), format(info.end, 'yyyy-MM-dd')],
			}
			createRecordModal.open()
		},
		eventClick: (info: { event: { id: string } }) => {
			$currentRecordId = info.event.id
		},
		eventTimeFormat: () => null,
		eventResize: (info: { event: { id: string; start: Date; end: Date } }) => {
			$updateRecord.mutate({
				tableId: $table.id.value,
				id: info.event.id,
				values: {
					[field.id.value]: [info.event.start, info.event.end],
				},
			})
		},
		eventDrop: (info: { event: { id: string; start: Date; end: Date } }) => {
			$updateRecord.mutate({
				tableId: $table.id.value,
				id: info.event.id,
				values: {
					[field.id.value]: [info.event.start, info.event.end],
				},
			})
		},
		theme,
	}
</script>

<div class="flex-1 overflow-y-auto p-4">
	<Calendar {plugins} {options} />
</div>

<style>
	:global(.ec-event.ec-preview) {
		z-index: 49;
	}

	:global(.ec-popup) {
		z-index: 10;
	}
</style>
