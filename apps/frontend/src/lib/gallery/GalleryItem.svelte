<script lang="ts">
	import CellComponent from '$lib/cell/CellComponents/CellComponent.svelte'
	import { getCellValue } from '$lib/cell/get-cell-value'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { currentRecordId, getTable, getView } from '$lib/store/table'
	import type { AttachmentFieldValue, Field, Record } from '@undb/core'
	import { Card, Dropzone, Tooltip, Carousel } from 'flowbite-svelte'
	import { fade } from 'svelte/transition'

	export let field: Field
	export let record: Record

	const table = getTable()
	const view = getView()

	$: fieldValue = record.values.value.get(field.id.value) as AttachmentFieldValue
	$: images = fieldValue.getImages().map((i) => ({
		id: i.id,
		name: i.name,
		imgurl: i.url,
		attribution: i.name,
	}))

	$: fields = $table.getOrderedFields($view, false).filter((f) => f.id.value !== field.id.value)

	function dropHandle(e: DragEvent): void {
		throw new Error('Function not implemented.')
	}

	function handleChange(e: Event): void {
		throw new Error('Function not implemented.')
	}
</script>

<Card
	class="shadow-sm hover:shadow-md transition !max-w-none !p-2"
	on:click={() => {
		$currentRecordId = record.id.value
	}}
>
	<div class="mb-2">
		{#if images.length}
			<Carousel divClass="h-auto" {images} loop showCaptions={false} showThumbs={false} />
		{:else}
			<div class="w-full aspect-square flex items-center justify-center bg-gray-100">
				<i class="ti ti-photo text-[120px]"></i>
			</div>
		{/if}
	</div>
	<div class="flex flex-col gap-2">
		{#each fields as field}
			{@const value = record.values.valuesPair[field.id.value]}
			<div class="flex items-center gap-2 dark:text-gray-200">
				<FieldIcon size={20} type={field.type} />
				<Tooltip
					class="z-[999]"
					transition={fade}
					params={{ delay: 100, duration: 200 }}
					placement="left"
					arrow={false}
				>
					{field.name.value}
				</Tooltip>
				<CellComponent {field} value={getCellValue(field, value)} displayValues={record.displayValues?.unpack()} />
			</div>
		{/each}
	</div>
</Card>
