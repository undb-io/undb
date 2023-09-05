<script lang="ts">
	import CellComponent from '$lib/cell/CellComponents/CellComponent.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { currentRecordId, getTable, getView } from '$lib/store/table'
	import type { AttachmentFieldValue, Field, Record } from '@undb/core'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import * as Card from '$lib/components/ui/card'
	import { register } from 'swiper/element/bundle'

	register()

	const onProgress = (e) => {
		const [swiper, progress] = e.detail
		console.log(progress)
	}
	const onSlideChange = (e) => {
		console.log('slide changed')
	}

	export let field: Field
	export let record: Record

	const table = getTable()
	const view = getView()

	$: fieldValue = record.values.value.get(field.id.value) as AttachmentFieldValue
	$: images = fieldValue
		.getImages()
		.filter(Boolean)
		.map((i) => ({
			id: i.id,
			name: i.name,
			imgurl: i.url,
			attribution: i.name,
		}))

	$: fields = $table.getOrderedFields($view, false).filter((f) => f.id.value !== field.id.value)
</script>

<Card.Root class="group shadow-sm hover:shadow-md transition !max-w-none !p-0 relative">
	<Card.Header class="px-3 py-1">
		<button
			on:click={() => ($currentRecordId = record.id.value)}
			class="top-5 right-5 z-50 py-1 px-2 border border-gray-200 shadow-md bg-gray-500/5 absolute transition opacity-0 group-hover:opacity-100 hover:shadow-lg rounded-md"
		>
			<i class="ti ti-external-link"></i>
		</button>
		<div class="mb-2">
			{#if images.length}
				<swiper-container
					slides-per-view={1}
					centered-slides={true}
					navigation="true"
					pagination="true"
					scrollbar="true"
					on:progress={onProgress}
					on:slidechange={onSlideChange}
				>
					{#each images as image}
						<swiper-slide>
							<img src={image.imgurl} alt={image.name} />
						</swiper-slide>
					{/each}
				</swiper-container>
			{:else}
				<div class="w-full aspect-square flex items-center justify-center bg-gray-100 text-gray-500 rounded-md">
					<i class="ti ti-photo text-[120px]"></i>
				</div>
			{/if}
		</div>
		<div class="flex flex-col gap-2 h-full">
			{#each fields as field}
				{@const value = record.values.value.get(field.id.value)}
				<div class="flex items-center gap-2 dark:text-gray-200">
					<Tooltip.Root openDelay={10}>
						<Tooltip.Trigger>
							<FieldIcon size={20} type={field.type} />
						</Tooltip.Trigger>
						<Tooltip.Content>
							{field.name.value}
						</Tooltip.Content>
					</Tooltip.Root>

					<CellComponent {record} {field} {value} displayValues={record.displayValues?.unpack()} />
				</div>
			{/each}
		</div>
	</Card.Header>
</Card.Root>
