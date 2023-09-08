<script lang="ts">
	import { currentRecordId, getRecord, getTable, getView } from '$lib/store/table'
	import * as Dialog from '$lib/components/ui/dialog'
	import { writable } from 'svelte/store'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { Label } from '$components/ui/label'

	const table = getTable()
	const view = getView()
	const record = getRecord()

	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)

	const open = writable<boolean>(false)
	$: {
		open.set(!!$currentRecordId)
	}
</script>

{#key $record}
	<Dialog.Root
		bind:open={$open}
		onOpenChange={(open) => {
			if (!open) {
				currentRecordId.set(undefined)
			}
		}}
	>
		<Dialog.Content class="!w-3/4 !max-w-none">
			{#if !$record}
				<div
					class="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-50 z-50 flex items-center justify-center"
				>
					<i class="ti ti-rotate animate-spin"></i>
				</div>
			{/if}
			<div class="space-y-5">
				<div class="grid grid-cols-5 gap-x-3 gap-y-4 items-center">
					{#each fields as field}
						<div class="h-full items-start gap-1 pt-2">
							<Label class="leading-5" for={field.id.value}>
								<div class="inline-flex items-center gap-2">
									<FieldIcon type={field.type} size={16} />
									<span>
										{field.name.value}
									</span>
								</div>
								{#if field.required}
									<span class="text-red-500">*</span>
								{/if}
							</Label>
						</div>
						<div class="col-span-4">
							<CellInput record={$record} {field} value={$record?.valuesJSON[field.id.value]} readonly />
						</div>
					{/each}
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/key}
