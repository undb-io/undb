<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { importCSVModal } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import { FieldId, getFieldNames, type ICreateTableSchemaInput, type IMutateRecordValueSchema } from '@undb/core'
	import { Button, Modal } from 'flowbite-svelte'
	import { Dropzone } from 'flowbite-svelte'
	import Papa from 'papaparse'

	let data: string[][] | undefined
	let fileName: string | undefined

	$: header = data?.[0]

	let schema: ICreateTableSchemaInput | undefined

	$: if (header) {
		schema = getFieldNames(header, $t).map((name) => ({ id: FieldId.createId(), name, type: 'string' }))
	}

	let records: IMutateRecordValueSchema[]
	$: if (schema) {
		records = (data?.slice(1) ?? []).map((values) =>
			values.reduce((prev, value, index) => {
				prev[schema![index].id!] = value
				return prev
			}, {} as IMutateRecordValueSchema),
		)
	}

	const parse = (file: File) => {
		fileName = file.name
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

	const createTable = trpc().table.create.mutation({
		async onSuccess(data, variables, context) {
			importCSVModal.close()
			await goto(`/t/${data.id}`)
			await invalidate('tables')
		},
	})

	const create = () => {
		if (fileName && schema?.length) {
			$createTable.mutate({
				name: fileName.substring(0, fileName.lastIndexOf('.')) || fileName,
				schema,
				records,
			})
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
			<span class="font-semibold">Click to upload</span> or drag and drop
		</p>
		<p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
	</Dropzone>
	{#if fileName}
		<div class="flex items-center gap-2">
			<i class="ti ti-file-code" />
			<span>
				{fileName}
			</span>
		</div>
	{/if}
	<div class="flex justify-end">
		<div class="space-y-2">
			<Button size="xs" outline color="alternative" on:click={() => importCSVModal.close()}>
				{$t('Cancel', { ns: 'common' })}
			</Button>
			<Button size="xs" disabled={!data} on:click={create}>
				{$t('Confirm', { ns: 'common' })}
			</Button>
		</div>
	</div>
</Modal>
