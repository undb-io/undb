<script lang="ts">
	import { t } from '$lib/i18n'
	import { importTemplate } from '$lib/store/modal'
	import { templateSchema, type ITemplateSchema } from '@undb/template'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Button } from '$components/ui/button'
	import { trpc } from '$lib/trpc/client'
	import { invalidateAll } from '$app/navigation'
	import Label from '$components/ui/label/label.svelte'
	import Checkbox from '$components/ui/checkbox/checkbox.svelte'

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

	const importTemplateMutateion = trpc().template.import.mutation({
		async onSuccess(data, variables, context) {
			importTemplate.close()
			await invalidateAll()
		},
	})

	let includeRecords = true
</script>

<Dialog.Root bind:open={$importTemplate.open}>
	<Dialog.Content class="overflow-y-auto !w-1/2 max-w-none max-h-[98%]">
		<Dialog.Header>
			<Dialog.Title>{$t('import template')}</Dialog.Title>
		</Dialog.Header>

		<div class="space-y-2">
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

			{#if template}
				<Label class="flex items-center gap-2">
					<Checkbox bind:checked={includeRecords} />
					<span>{$t('import template include records')}</span>
				</Label>
			{/if}
		</div>
		<Dialog.Footer>
			<div class="w-full flex justify-end gap-4">
				<Button
					size="sm"
					variant="secondary"
					on:click={() => {
						importTemplate.close()
					}}
				>
					{$t('Cancel', { ns: 'common' })}
				</Button>
				<Button
					size="sm"
					disabled={!template}
					on:click={() => {
						if (!template) return
						$importTemplateMutateion.mutate({
							template,
							includeRecords,
						})
					}}
				>
					{$t('Confirm', { ns: 'common' })}
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
