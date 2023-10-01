<script lang="ts">
	import Button from '$components/ui/button/button.svelte'
	import { t } from '$lib/i18n'
	import { createRecordInitial, createRecordModal } from '$lib/store/modal'
	import { currentRecordId, getTable, listRecordFn, recordsStore } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import Calendar, { TZDate, type EventObject } from '@toast-ui/calendar'
	import '@toast-ui/calendar/dist/toastui-calendar.min.css'
	import { RecordFactory, type DateField } from '@undb/core'
	import { format } from 'date-fns'
	import { tick } from 'svelte'
	import { toast } from 'svelte-sonner'

	export let field: DateField
	const table = getTable()

	let start: Date | undefined = undefined
	let end: Date | undefined = undefined

	let el: HTMLDivElement | undefined

	let range = ''
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
	}

	const setDateRange = () => {
		if (!calendar) return
		start = calendar.getDateRangeStart().toDate()
		end = calendar.getDateRangeEnd().toDate()
	}

	$: if (calendar) {
		setDateRange()
	}

	$: if (start && end) {
		range = getNavbarRange()
	}

	const updateRecord = trpc().record.update.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('RECORD.UPDATED', { ns: 'success' }))
			await $data.refetch()
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

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

		calendar.on('beforeUpdateEvent', (info) => {
			if (info.changes.start instanceof TZDate) {
				calendar.updateEvent(info.event.id, info.event.calendarId, info.changes)
				$updateRecord.mutate({
					tableId: $table.id.value,
					id: info.event.id,
					values: {
						[field.id.value]: info.changes.start.toDate(),
					},
				})
			}
		})
	}

	const getNavbarRange = () => {
		if (!start || !end) return ''
		const middle = new Date(start.getTime() + (end.getTime() - start.getTime()) / 2)

		return format(middle, 'yyyy-MM')
	}

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
		const title = record.getDisplayFieldsValue($table)

		return {
			id: record.id.value,
			title: title || $t('unnamed', { ns: 'common' }),
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
			backgroundColor: 'hsl(var(--primary) / 0.75)',
		}
	}) satisfies EventObject[]

	$: if (calendar) {
		calendar.clear()
		calendar.createEvents(events)
		bindEvents(calendar)
	}
</script>

<div class="w-full h-full flex flex-col" id="calendar-date">
	<div class="px-3 py-1.5 border-b flex items-center">
		<div class="flex-1"></div>
		<div class="flex gap-4 items-center">
			<Button
				size="icon"
				variant="outline"
				on:click={async () => {
					calendar?.prev()
					setDateRange()
					await tick()
					$data.refetch()
				}}
			>
				<i class="ti ti-chevron-left"></i>
			</Button>
			<span class="text-gray-700 text-sm">
				{range}
			</span>
			<Button
				size="icon"
				variant="outline"
				on:click={async () => {
					calendar?.next()
					setDateRange()
					await tick()
					$data.refetch()
				}}
			>
				<i class="ti ti-chevron-right"></i>
			</Button>
		</div>
		<div class="flex-1 flex justify-end">
			<Button
				size="sm"
				variant="outline"
				on:click={async () => {
					calendar?.today()
					setDateRange()
					await tick()
					$data.refetch()
				}}
			>
				{$t('TODAY', { ns: 'common' })}
			</Button>
		</div>
	</div>
	<div bind:this={el} class="flex-1 w-full"></div>
</div>
