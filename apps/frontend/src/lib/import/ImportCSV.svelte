<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import Number from '$lib/cell/CellComponents/Number.svelte'
	import { t } from '$lib/i18n'
	import { importCSVModal } from '$lib/store/modal'
	import CreateTableFieldAccordionItem from '$lib/table/CreateTableFieldAccordionItem.svelte'
	import { trpc } from '$lib/trpc/client'
	import {
		FieldId,
		getFieldNames,
		inferFieldType,
		type ICreateTableSchemaInput,
		type IMutateRecordValueSchema,
		createTableInput,
	} from '@undb/core'
	import { Accordion, Button, Checkbox, Modal } from 'flowbite-svelte'
	import { Dropzone } from 'flowbite-svelte'
	import { unzip } from 'lodash-es'
	import Papa from 'papaparse'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'

	export let formData: Validation<typeof createTableInput>

	let data: string[][] | undefined
	let fileName: string | undefined
	let firstRowAsHeader = true
	let importData = true

	const inferFieldTypeCount = 200
	let opened: Record<string, boolean> = {}

	const createTable = trpc().table.create.mutation({
		async onSuccess(data, variables, context) {
			importCSVModal.close()
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

	$: if (header) {
		$form.schema = getFieldNames(header, $t).map((name, index) => ({
			...inferFieldType(transposed[index]),
			id: FieldId.createId(),
			name,
			display: index === 0,
		})) as ICreateTableSchemaInput
	}

	let records: IMutateRecordValueSchema[]
	$: if ($form.schema) {
		records = (data?.slice(1) ?? []).map((values) =>
			values.reduce((prev, value, index) => {
				const type = $form.schema.at(index)?.type
				const v = type === 'number' ? globalThis.Number(value) : value

				prev[$form.schema![index].id!] = v
				return prev
			}, {} as IMutateRecordValueSchema),
		)
	}

	const parse = (file: File) => {
		fileName = file.name
		$form.name = fileName.substring(0, fileName.lastIndexOf('.')) || fileName
		Papa.parse<string[]>(file, {
			complete(results, file) {
				if (results.data.length > 1) {
					data = results.data
				}
			},
		})
	}

	const dropHandle = (event: DragEvent) => {
		event.preventDefault()
		const files = event.dataTransfer?.files
		if (!!files?.length) {
			parse(files[0])
		}
	}

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement
		const files = target.files
		if (!!files?.length) {
			parse(files[0])
		}
	}
</script>

<Modal class="w-full" bind:open={$importCSVModal.open}>
	<Dropzone
		accept=".csv"
		id="dropzone"
		on:drop={dropHandle}
		on:dragover={(event) => {
			event.preventDefault()
		}}
		on:change={handleChange}
	>
		<svg
			aria-hidden="true"
			class="mb-3 w-10 h-10 text-gray-400"
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
	{#if fileName}
		<div class="flex items-center gap-2">
			<i class="ti ti-file-code" />
			<span>
				{fileName}
			</span>
		</div>
	{/if}

	{#if $form.schema?.length}
		<Accordion class="my-4">
			{#each $form.schema as field, i (field.id)}
				<CreateTableFieldAccordionItem bind:open={opened[field.id ?? '']} {superFrm} {i} {field} isNew />
			{/each}
		</Accordion>
	{/if}

	<Checkbox bind:checked={firstRowAsHeader}>{$t('first row as header')}</Checkbox>
	<Checkbox bind:checked={importData}>{$t('import data')}</Checkbox>

	<div class="flex justify-end">
		<form class="space-y-2" id="importCSV" method="POST" use:enhance>
			<Button size="xs" outline color="alternative" on:click={() => importCSVModal.close()}>
				{$t('Cancel', { ns: 'common' })}
			</Button>
			<Button size="xs" disabled={!data} type="submit">
				{$t('Confirm', { ns: 'common' })}
			</Button>
		</form>
	</div>
</Modal>
