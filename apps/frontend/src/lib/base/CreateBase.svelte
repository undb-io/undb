<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation'
	import { Button } from '$components/ui/button'
	import Input from '$components/ui/input/input.svelte'
	import Label from '$components/ui/label/label.svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import TablesPicker from '$lib/field/FieldInputs/TablesPicker.svelte'
	import { t } from '$lib/i18n'
	import { createBaseModal } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import { BaseId, createBaseSchema } from '@undb/core'
	import { toast } from 'svelte-sonner'
	import * as Tabs from '$lib/components/ui/tabs'
	import { templateSchema, type ITemplateSchema } from '@undb/template'

	let name = ''
	let tableIds: string[] = []

	$: valid = createBaseSchema.safeParse({ name }).success

	const createBaseMutation = trpc().base.create.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('BASE.CREATED', { ns: 'success', name }))
			await invalidateAll()
			name = ''
			tableIds = []
			createBaseModal.close()
			if (variables.tableIds?.length) {
				await goto(`/t/${variables.tableIds.at(0)}`)
			} else {
				await goto(`/bases/${variables.id}`)
			}
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const onSubmit = (e: Event) => {
		e.preventDefault()

		$createBaseMutation.mutate({
			id: BaseId.createId(),
			name,
			tableIds: tableIds.length ? tableIds : undefined,
			template,
		})
	}

	let file: File | undefined
	const handleChange = async (event: Event) => {
		const target = event.target as HTMLInputElement
		const files = target.files
		if (!!files?.length) {
			file = files[0]
		}
	}

	let template: ITemplateSchema | undefined = undefined
	const handleFile = async (file: File | undefined) => {
		if (!file) return

		const text = await file.text()
		const json = JSON.parse(text)

		template = await templateSchema.parseAsync(json)
	}
	$: if (file) {
		handleFile(file)
	}
</script>

<Dialog.Root bind:open={$createBaseModal.open}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{$t('Create New Base', { ns: 'base' })}
			</Dialog.Title>
		</Dialog.Header>

		<form action="POST" id="createBase" on:submit={onSubmit}>
			<div class="space-y-2">
				<Label class="block space-y-2">
					<span>
						{$t('Name', { ns: 'common' })}
					</span>
					<Input bind:value={name} placeholder={$t('Base Name Placeholder', { ns: 'base' })} />
				</Label>
				<Tabs.Root value="tables" class="mt-4">
					<Tabs.List class="grid w-full grid-cols-2">
						<Tabs.Trigger value="tables">{$t('Select Base Table', { ns: 'base' })}</Tabs.Trigger>
						<Tabs.Trigger value="template">{$t('Import Base Template', { ns: 'base' })}</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="tables">
						<Label class="block space-y-2">
							<TablesPicker bind:value={tableIds} class="w-full" filter={(table) => !table.baseId} />
						</Label>
					</Tabs.Content>
					<Tabs.Content value="template">
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
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</form>

		<Dialog.Footer>
			<div class="w-full flex justify-end gap-4 mt-4">
				<Button size="sm" type="button" variant="secondary">{$t('Cancel', { ns: 'common' })}</Button>
				<Button size="sm" form="createBase" type="submit" disabled={!valid}>{$t('Confirm', { ns: 'common' })}</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
