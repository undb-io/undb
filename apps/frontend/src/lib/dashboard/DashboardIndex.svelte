<script lang="ts">
	// @ts-ignore
	import Grid from 'svelte-grid'
	// @ts-ignore
	import gridHelp from 'svelte-grid/build/helper/index.mjs'
	import { Button } from 'flowbite-svelte'
	import { trpc } from '$lib/trpc/client'
	import { getTable, getView } from '$lib/store/table'
	import { Widge, WidgeID } from '@undb/core'

	const table = getTable()
	const view = getView()

	const COLS = 12

	let items: any[] = []

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
			}),
			id,
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
			widge: { layout, virtualization: { type: 'number' } },
		})

		items = [...items, ...[newItem]]
	}
</script>

<div class="w-full h-full">
	<Button on:click={addItem}>add widge</Button>
	<Grid bind:items rowHeight={100} let:item let:dataItem {cols}>
		<div class="flex items-center justify-center bg-white-200 border rounded-md w-full h-full">
			{dataItem.id}
		</div>
	</Grid>
</div>
