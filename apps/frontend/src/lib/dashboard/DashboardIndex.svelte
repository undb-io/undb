<script lang="ts">
	// @ts-ignore
	import Grid from 'svelte-grid'
	// @ts-ignore
	import gridHelp from 'svelte-grid/build/helper/index.mjs'
	import { Button, P } from 'flowbite-svelte'
	import { trpc } from '$lib/trpc/client'
	import { dashboardWidges, getTable, getView } from '$lib/store/table'
	import { Widge, WidgeID, type IRelayoutWidgeSchema } from '@undb/core'
	import Virsualization from '$lib/virsualization/Virsualization.svelte'
	import { invalidate } from '$app/navigation'
	import { writable } from 'svelte/store'

	const table = getTable()
	const view = getView()

	const widges = writable<Widge[]>([...$dashboardWidges])
	$: widges.set([...$dashboardWidges])
	const COLS = 24

	let items: any[]

	const getItems = () => {
		items =
			$widges.map((widge) => ({
				[COLS]: gridHelp.item({
					...widge.layout.toJSON(),
					customDragger: true,
					customResizer: true,
				}),
				id: widge.id.value,
				widge: widge as Widge | null,
			})) ?? []
	}

	$: $view, getItems()

	const cols = [[1200, COLS]]

	const createWidge = trpc().table.view.dashboard.createWidge.mutation()
	const addItem = async () => {
		const id = WidgeID.createId()
		let newItem = {
			[COLS]: gridHelp.item({
				w: 2,
				h: 2,
				x: 0,
				y: 0,
				customDragger: true,
				customResizer: true,
			}),
			id,
			widge: null,
		}

		let findOutPosition = gridHelp.findSpace(newItem, items, COLS)

		newItem = {
			...newItem,
			[COLS]: {
				...newItem[COLS],
				...findOutPosition,
			},
		}
		const itemLayout = newItem[COLS]
		const { x, y, h, w } = itemLayout
		const layout = { x, y, h, w }

		await $createWidge.mutateAsync({
			tableId: $table.id.value,
			viewId: $view.id.value,
			widge: { layout, virsualization: { type: 'number' } },
		})
		await invalidate(`table:${$table.id.value}`)

		items = [...items, ...[newItem]]
	}

	const relayoutWidges = trpc().table.view.dashboard.relayoutWidges.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const onPointeup = () => {
		const widges: IRelayoutWidgeSchema[] = items.map((item) => {
			const { x, y, h, w } = item[COLS]
			const layout = { x, y, h, w }
			return { id: item.id, layout }
		})

		$relayoutWidges.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			widges,
		})
	}
</script>

<div class="w-full h-full">
	<Button on:click={addItem}>add widge</Button>
	<Grid
		bind:items
		rowHeight={100}
		let:item
		let:dataItem
		{cols}
		fastStart
		let:movePointerDown
		let:resizePointerDown
		on:pointerup={onPointeup}
	>
		<div
			class="group flex flex-col bg-white !opacity-100 border rounded-md w-full h-full hover:border-blue-400 transition"
		>
			<div class="flex items-center gap-2 border-b border-gray-300 p-3 grow-0">
				<i on:pointerdown={movePointerDown} class="block ti ti-grip-vertical cursor-grab" />
				<P class="font-semibold">name</P>
			</div>
			<div class="flex items-center justify-center p-2 flex-1">
				<Virsualization virsualization={dataItem.widge?.virsualization} />
			</div>
			<i
				class="absolute right-0 bottom-0 cursor-se-resize
				hidden group-hover:block text-3xl text-blue-400
				ti ti-chevron-down-right"
				on:pointerdown={resizePointerDown}
			/>
		</div>
	</Grid>
</div>

<style>
	:global(.svlt-grid-shadow) {
		/* Back shadow */
		background: #dbeafe !important;
		opacity: 0.5;
		border: 2px #2563eb dashed;
		border-radius: 4px;
	}

	:global(.svlt-grid-item) {
		opacity: 1 !important;
	}
</style>
