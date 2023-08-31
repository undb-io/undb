<script lang="ts">
	import { t } from '$lib/i18n'
	import { mergeDataModal } from '$lib/store/modal'
	import { Button, Dropzone, Modal } from 'flowbite-svelte'
	import { parse, type SheetData } from './import.helper'
	import { getTable } from '$lib/store/table'
	import { castFieldValue, type IMutateRecordValueSchema } from '@undb/core'
	import { trpc } from '$lib/trpc/client'

	const table = getTable()

	let data: SheetData | undefined

	const createRecords = trpc().record.buldCreate.mutation({
		onSuccess(data, variables, context) {
			mergeDataModal.close()
		},
	})

	$: header = data?.[0]
	$: body = data?.slice(1)

	$: schema = $table.schema.toNameMap()

	$: records = body
		?.map((values) => {
			return values.reduce((prev, value, index) => {
				const title = header?.[index]
				if (!title) return prev

				const field = schema.get(String(title))
				if (!field || field.controlled) return prev

				const type = field.type

				prev[field.id.value] = type ? castFieldValue(type, value) : value
				return prev
			}, {} as IMutateRecordValueSchema)
		})
		.filter(Boolean)

	let ext: string | undefined
	let file: File | undefined

	const dropHandle = async (event: DragEvent) => {
		event.preventDefault()
		const files = event.dataTransfer?.files
		if (!!files?.length) {
			file = files[0]
		}
	}

	const handleChange = async (event: Event) => {
		const target = event.target as HTMLInputElement
		const files = target.files
		if (!!files?.length) {
			file = files[0]
		}
	}

	const handleFile = async (file: File | undefined) => {
		if (!file) return

		const parsed = await parse(file)
		data = parsed.data
		ext = parsed.extension
	}

	$: if (file) {
		handleFile(file)
	}
</script>

<Modal class="w-full" bind:open={$mergeDataModal.open}>
	<Dropzone
		accept=".csv, .json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
		id="dropzone"
		on:drop={dropHandle}
		on:dragover={(event) => {
			event.preventDefault()
		}}
		on:change={handleChange}
	>
		<svg
			aria-hidden="true"
			class="mb-3 w-10 h-10 text-gray-400 dark:text-gray-200"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
			/>
		</svg>
		<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
			{@html $t('click to upload or dnd', { ns: 'common' })}
		</p>
	</Dropzone>

	<div class="flex justify-end items-center gap-2">
		<Button size="xs" type="button" outline color="alternative" on:click={() => mergeDataModal.close()}>
			{$t('Cancel', { ns: 'common' })}
		</Button>
		<Button
			size="xs"
			disabled={!data || $createRecords.isLoading}
			on:click={() => {
				if (!records?.length) return
				$createRecords.mutate({
					tableId: $table.id.value,
					records: records.map((record) => ({ values: record })),
				})
			}}
		>
			<div class="flex items-center">
				{$t('Confirm', { ns: 'common' })}
			</div>
		</Button>
	</div>
</Modal>
