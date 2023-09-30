<script lang="ts">
	import { createRecordInitial, createRecordModal } from '$lib/store/modal'
	import { currentRecordId, getTable, listRecordFn, recordsStore } from '$lib/store/table'
	import Calendar, { type EventObject } from '@toast-ui/calendar'
	import '@toast-ui/calendar/dist/toastui-calendar.min.css'
	import { RecordFactory, type DateField } from '@undb/core'

	export let field: DateField
	const table = getTable()

	let start: Date | undefined = undefined
	let end: Date | undefined = undefined

	let el: HTMLDivElement | undefined

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

	$: events = $records.map((record) => {
		const values = record.valuesJSON
		const title = record.getDisplayFieldsValue($table) || record.id.value

		return {
			id: record.id.value,
			title,
			isAllday: true,
			isPrivate: false,
			location: '',
			body: '',
			recurrenceRule: '',
			start: new Date(values[field.id.value]),
			end: new Date(values[field.id.value]),
			goingDuration: 0,
			comingDuration: 0,
			state: 'Free',
			attendees: [],
			dueDateClass: '',
			category: 'allday',
			isVisible: true,
			isPending: false,
			isReadOnly: false,
			isFocused: false,
			customStyle: {},
			backgroundColor: 'hsl(var(--primary))',
		}
	}) satisfies EventObject[]

	let calendar: Calendar | undefined = undefined
	$: if (el) {
		calendar = new Calendar(el, {
			defaultView: 'month',
			usageStatistics: false,
			template: {
				allday(event) {
					return `<span class="text-white">${event.title}</span>`
				},
			},
		})

		start = calendar.getDateRangeStart().toDate()
		end = calendar.getDateRangeEnd().toDate()
	}

	$: if (calendar) {
		calendar.clear()
		calendar.createEvents(events)
		bindEvents(calendar)
	}

	const bindEvents = (calendar: Calendar) => {
		calendar.on('clickEvent', (event) => {
			$currentRecordId = event.event.id
		})
		calendar.on('selectDateTime', (event) => {
			createRecordInitial.set({
				[field.id.value]: event.start.toISOString(),
			})
			calendar.clearGridSelections()
			createRecordModal.open()
		})
	}
</script>

<div bind:this={el} class="h-full w-full"></div>
