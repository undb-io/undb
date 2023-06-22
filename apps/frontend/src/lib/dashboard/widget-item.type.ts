import type { Widget } from '@undb/core'

export interface WidgetDataItem {
	[key: number]: {
		x: number
		y: number
		h: number
		w: number
	}
	id: string
	widget: Widget | null
}
