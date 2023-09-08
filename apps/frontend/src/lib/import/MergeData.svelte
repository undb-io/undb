<script lang="ts">
	import { t } from '$lib/i18n'
	import { mergeDataModal } from '$lib/store/modal'
	import * as Alert from '$lib/components/ui/alert'
	import { Button } from '$lib/components/ui/button'
	import { Badge } from '$lib/components/ui/badge'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import { parse, type SheetData } from './import.helper'
	import { getTable } from '$lib/store/table'
	import { castFieldValue, type IFieldType, type IMutateRecordValueSchema } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import { isEmpty } from 'lodash-es'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import * as Dialog from '$lib/components/ui/dialog'

	const table = getTable()

	let data: SheetData | undefined

	const unsupportedMergeType: IFieldType[] = ['reference', 'attachment', 'parent', 'tree', 'collaborator']

	const createRecords = trpc().record.buldCreate.mutation({
		onSuccess(data, variables, context) {
			mergeDataModal.close()
		},
	})

	$: header = data?.[0] ?? []
	$: importHeaders = header.map((title) => schema.get(String(title))!).filter(Boolean)
	$: unsupportedFields = importHeaders.filter((field) => unsupportedMergeType.includes(field.type))
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

				// TODO: support these field types
				if (unsupportedMergeType.includes(type)) return prev

				prev[field.id.value] = type ? castFieldValue(type, value) : value
				return prev
			}, {} as IMutateRecordValueSchema)
		})
		.filter((value) => !isEmpty(value))

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

<Dialog.Root bind:open={$mergeDataModal.open}>
	<Dialog.Content class="!w-1/2">
		<div class="flex items-center justify-center w-full" on:drop={dropHandle} on:dragover={(e) => e.preventDefault()}>
			<label
				class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
			>
				<div class="flex flex-col items-center justify-center pt-5 pb-6">
					<svg
						class="w-10 h-10 mb-3 text-gray-400"
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
						>
						</path>
					</svg>
					<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
						{@html $t('click to upload or dnd', { ns: 'common' })}
					</p>
				</div>
				<input
					type="file"
					class="hidden"
					accept=".csv, .json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
					on:change={handleChange}
				/>
			</label>
		</div>

		{#if !!unsupportedFields.length}
			<Alert.Root class="border-yellow-600 bg-yellow-50">
				<Alert.Description class="text-yellow-600">
					{$t('unsupport merge')}
				</Alert.Description>
				<div class="flex items-center gap-2 mt-2 flex-wrap">
					{#each unsupportedFields as field}
						<Tooltip.Root openDelay={50}>
							<Tooltip.Trigger>
								<Badge variant="secondary" class="inline-flex items-center gap-2 whitespace-nowrap">
									<FieldIcon type={field.type} />
									{field.name.value}
								</Badge>
							</Tooltip.Trigger>
							<Tooltip.Content>
								{$t(field.type)}
							</Tooltip.Content>
						</Tooltip.Root>
					{/each}
				</div>
			</Alert.Root>
		{/if}
		<Dialog.Footer>
			<Button size="sm" type="button" variant="secondary" on:click={() => mergeDataModal.close()}>
				{$t('Cancel', { ns: 'common' })}
			</Button>

			<Tooltip.Root openDelay={50}>
				<Tooltip.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						size="sm"
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
				</Tooltip.Trigger>
				{#if records?.length}
					<Tooltip.Content>
						{$t('merge record count', { count: records.length })}
					</Tooltip.Content>
				{/if}
			</Tooltip.Root>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
