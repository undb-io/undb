import type { Widge } from '@undb/core'

export interface WidgeDataItem {
	[key: number]: {
		x: number
		y: number
		h: number
		w: number
	}
	id: string
	widge: Widge | null
}
