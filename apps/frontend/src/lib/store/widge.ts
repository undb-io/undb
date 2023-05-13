import type { WidgeDataItem } from '$lib/dashboard/widge-item.type'
import { WidgeID, type Widge } from '@undb/core'
import { writable } from 'svelte/store'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gridHelp from 'svelte-grid/build/helper/index.mjs'

export const COLS = 24

export const createWidgeItems = () => {
	const { subscribe, set, update } = writable<WidgeDataItem[]>([])

	let $widgeItems: WidgeDataItem[] = []

	subscribe((items) => {
		$widgeItems = items
	})

	const init = (widges: Widge[]) => {
		set(
			widges.map((widge) => ({
				[COLS]: gridHelp.item({
					...widge.layout.toJSON(),
					min: {
						w: 3,
						h: 2,
					},
					customDragger: true,
					customResizer: true,
				}),
				id: widge.id.value,
				widge: widge as Widge | null,
			})) ?? [],
		)
	}

	const add = () => {
		const id = WidgeID.createId()
		let newItem = {
			[COLS]: gridHelp.item({
				w: 6,
				h: 2,
				x: 0,
				y: 0,
				min: {
					w: 4,
					h: 2,
				},
				customDragger: true,
				customResizer: true,
			}),
			id,
			widge: null,
		}

		const findOutPosition = gridHelp.findSpace(newItem, $widgeItems, COLS)

		newItem = {
			...newItem,
			[COLS]: {
				...newItem[COLS],
				...findOutPosition,
			},
		}

		update(($widgeItems) => [...$widgeItems, ...[newItem]])

		return newItem
	}

	const remove = (id: string) => {
		const widgeItems = $widgeItems.filter((w) => w.widge?.id.value !== id)
		$widgeItems = widgeItems
		$widgeItems = gridHelp.adjust(widgeItems, COLS)
		return $widgeItems
	}

	return {
		subscribe,
		set,
		update,
		init,
		add,
		remove,
	}
}
export const widgeItems = createWidgeItems()
