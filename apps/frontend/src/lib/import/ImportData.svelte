<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { importDataModal } from '$lib/store/modal'
	import CreateTableFieldAccordionItem from '$lib/table/CreateTableFieldAccordionItem.svelte'
	import { trpc } from '$lib/trpc/client'
	import {
		FieldId,
		getFieldNames,
		inferFieldType,
		type ICreateTableSchemaInput,
		type IMutateRecordValueSchema,
		createTableInput,
		castFieldValue,
	} from '@undb/core'
	import * as Accordion from '$lib/components/ui/accordion'
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$components/ui/button'
	import { Checkbox } from '$lib/components/ui/checkbox'
	import { unzip } from 'lodash-es'
	import { parse, type SheetData } from './import.helper'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'
	import * as Dialog from '$lib/components/ui/dialog'

	export let formData: Validation<typeof createTableInput>

	let data: SheetData | undefined
	let fileName: string | undefined
	let firstRowAsHeader = true
	let ext: string | undefined
	let flatten = false
	let importData = true
	let file: File | undefined

	const inferFieldTypeCount = 200

	const createTable = trpc().table.create.mutation({
		async onSuccess(data, variables, context) {
			importDataModal.close()
			await goto(`/t/${data.id}`)
			await invalidate('tables')
		},
	})

	const superFrm = superForm(formData, {
		id: 'createTable',
		SPA: true,
		applyAction: false,
		resetForm: false,
		invalidateAll: true,
		clearOnSubmit: 'errors-and-message',
		dataType: 'json',
		taintedMessage: null,
		async onUpdate(event) {
			$createTable.mutate({
				name: event.form.data.name,
				schema: $form.schema,
				records: importData ? records : undefined,
			})
		},
	})

	const { form, enhance } = superFrm

	$: firstRow = data?.[0]

	$: transposed = firstRowAsHeader
		? unzip(data?.slice(1)).slice(0, inferFieldTypeCount)
		: unzip(data).slice(0, inferFieldTypeCount)

	$: header = firstRowAsHeader
		? firstRow
		: new Array(data?.[0].length).fill(undefined).map((_, index) => $t('Field') + ' ' + String(index + 1))

	$: body = firstRowAsHeader ? data?.slice(1) : data

	$: if (header) {
		$form.schema = getFieldNames(header as string[], $t).map((name, index) => ({
			...inferFieldType(transposed[index]),
			id: FieldId.createId(),
			name,
			display: index === 0,
		})) as ICreateTableSchemaInput
	}

	let records: IMutateRecordValueSchema[]
	$: if ($form.schema) {
		records = (body ?? []).map((values) =>
			values.reduce((prev, value, index) => {
				const type = $form.schema.at(index)?.type
				const id = $form.schema![index]?.id
				if (id) {
					prev[id] = type ? castFieldValue(type, value) : value
				}
				return prev
			}, {} as IMutateRecordValueSchema),
		)
	}

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

		const parsed = await parse(file, { flatten })
		data = parsed.data
		$form.name = parsed.name
		ext = parsed.extension
	}

	$: flatten, handleFile(file)
</script>

<Dialog.Root bind:open={$importDataModal.open}>
	<Dialog.Content class="overflow-y-auto !w-1/2 max-w-none max-h-[98%]">
		<Dialog.Header>
			<Dialog.Title>{$t('import data')}</Dialog.Title>
		</Dialog.Header>

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
					{@html $t('click to upload or dnd', { ns: 'common' })}
				</div>
				<input
					type="file"
					class="hidden"
					accept=".csv, .json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
					on:change={handleChange}
				/>
			</label>
		</div>

		{#if fileName}
			<div class="flex items-center gap-2">
				<i class="ti ti-file-code" />
				<span>
					{fileName}
				</span>
			</div>
		{/if}

		{#if $form.schema?.length}
			<Accordion.Root class="my-4">
				{#each $form.schema as field, i (field.id)}
					<CreateTableFieldAccordionItem {superFrm} {i} {field} isNew />
				{/each}
			</Accordion.Root>
		{/if}

		{#if data}
			<div>
				<Label for="import_data_name" class="mb-2">{$t('Name', { ns: 'common' })}</Label>
				<Input disabled={!data} bind:value={$form.name} id="import_data_name" />
			</div>
			<Label class="flex items-center gap-2">
				<Checkbox bind:checked={firstRowAsHeader}></Checkbox>
				{$t('first row as header')}
			</Label>
			<Label class="flex items-center gap-2">
				<Checkbox bind:checked={importData}></Checkbox>
				{$t('import data')}
			</Label>
			{#if ext === 'json'}
				<Label class="flex items-center gap-2">
					<Checkbox bind:checked={flatten}></Checkbox>
					{$t('flatten import data')}
				</Label>
			{/if}

			<div class="flex justify-end">
				<form id="importData" method="POST" use:enhance>
					<div class="flex items-center gap-2">
						<Button size="sm" type="button" variant="secondary" on:click={() => importDataModal.close()}>
							{$t('Cancel', { ns: 'common' })}
						</Button>
						<Button size="sm" disabled={!data || $createTable.isLoading} type="submit">
							<div class="flex items-center gap-2">
								{#if $createTable.isLoading}
									<i class="ti ti-rotate animate-spin"></i>
								{/if}
								{$t('Confirm', { ns: 'common' })}
							</div>
						</Button>
					</div>
				</form>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
