import type { WidgetDataItem } from '$lib/dashboard/widget-item.type'
import { WidgetID, type IVisualizationTypeSchema, type Widget } from '@undb/core'
import { writable } from 'svelte/store'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gridHelp from 'svelte-grid/build/helper/index.mjs'

export const COLS = 24

const defaultLayout: Record<
	IVisualizationTypeSchema,
	{ x: number; y: number; h: number; w: number; min: { w: number; h: number } }
> = {
	number: {
		w: 6,
		h: 2,
		x: 0,
		y: 0,
		min: {
			w: 4,
			h: 2,
		},
	},
	chart: {
		w: 6,
		h: 4,
		x: 0,
		y: 0,
		min: {
			w: 4,
			h: 2,
		},
	},
}

const createWidgetItems = () => {
	const { subscribe, set, update } = writable<WidgetDataItem[]>([])

	let $widgetItems: WidgetDataItem[] = []

	subscribe((items) => {
		$widgetItems = items
	})

	const init = (widgets: Widget[]) => {
		set(
			widgets.map((widget) => ({
				[COLS]: gridHelp.item({
					...widget.layout.toJSON(),
					min: widget.visualization ? defaultLayout[widget.visualization.type].min : { w: 3, h: 2 },
					customDragger: true,
					customResizer: true,
				}),
				id: widget.id.value,
				widget: widget as Widget | null,
			})) ?? [],
		)
	}

	const add = (type: IVisualizationTypeSchema) => {
		const id = WidgetID.createId()
		let newItem = {
			[COLS]: gridHelp.item({
				...defaultLayout[type],
				customDragger: true,
				customResizer: true,
			}),
			id,
			widget: null,
		}

		const findOutPosition = gridHelp.findSpace(newItem, $widgetItems, COLS)

		newItem = {
			...newItem,
			[COLS]: {
				...newItem[COLS],
				...findOutPosition,
			},
		}

		update(($widgetItems) => [...$widgetItems, ...[newItem]])

		return newItem
	}

	const remove = (id: string) => {
		const widgetItems = $widgetItems.filter((w) => w.widget?.id.value !== id)
		$widgetItems = widgetItems
		$widgetItems = gridHelp.adjust(widgetItems, COLS)
		return $widgetItems
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
export const widgetItems = createWidgetItems()
