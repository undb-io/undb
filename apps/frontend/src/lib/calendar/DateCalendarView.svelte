<script lang="ts">
	import { currentRecordId, getTable, listRecordFn, readonly, recordsStore } from '$lib/store/table'
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
	import { createRecordInitial, createRecordModal } from '$lib/store/modal'
	import { theme } from './calendar-theme'
	import { t } from '$lib/i18n'

	export let field: DateField

	const table = getTable()

	let date = new Date()

	let start: Date | undefined
	let end: Date | undefined

	const updateRecord = trpc().record.update.mutation({
		async onSuccess(data, variables, context) {},
	})

	$: data = $listRecordFn(
		[
			{
				path: field.id.value,
				type: field.type,
				value: [start?.toISOString()!, end?.toISOString()!],
				operator: '$between',
			},
		],
		{
			enabled: !!start && !!end,
		},
	)

	$: recordsStore.setAllRecords(
		RecordFactory.fromQueryRecords($data?.data?.records ?? [], $table.schema.toIdMap()) ?? [],
	)
	$: records = recordsStore.records
	$: events =
		$records?.map((record) => {
			const values = record.valuesJSON
			const title = record.getDisplayFieldsValue($table)
			const titleHTML = !title ? `<span class="opacity-80">${$t('unnamed', { ns: 'common' })}</span>` : ''
			return {
				id: record.id.value,
				title,
				titleHTML,
				start: new Date(values[field.id.value]),
				end: new Date(values[field.id.value]),
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
			if ($readonly) return
			$createRecordInitial = { [field.id.value]: info.date.toISOString() }
			createRecordModal.open()
		},
		events,
		eventClick: (info: { event: { id: string } }) => {
			$currentRecordId = info.event.id
		},
		selectable: false,
		eventDurationEditable: false,
		eventTimeFormat: () => '',
		editable: !$readonly,
		eventDrop: $readonly
			? undefined
			: (info: { event: { id: string; start: Date; end: Date } }) => {
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

<div class="flex-1 overflow-y-auto p-4 dark:!text-gray-200 h-full">
	<Calendar {plugins} {options} />
</div>
