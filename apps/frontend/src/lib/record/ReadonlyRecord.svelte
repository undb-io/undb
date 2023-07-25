<script lang="ts">
	import { currentRecordId, getRecord, getTable, getView } from '$lib/store/table'
	import { Label, Modal, Spinner } from 'flowbite-svelte'
	import { writable } from 'svelte/store'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'

	const table = getTable()
	const view = getView()
	const record = getRecord()

	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)

	const open = writable<boolean>(false)
	$: {
		open.set(!!$currentRecordId)
	}
	$: if (!$open) {
		currentRecordId.set(undefined)
	}
</script>

{#key $record}
	<Modal class="w-full" size="lg" bind:open={$open} outsideclose>
		{#if !$record}
			<div class="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-50 z-50 flex items-center justify-center">
				<Spinner />
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
	</Modal>
{/key}
