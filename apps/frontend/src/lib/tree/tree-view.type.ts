import type { Record } from '@undb/core'

export type TreeRecord = {
	id?: string
	record: Record | null
	children: TreeRecord[]
	[key: string]: any
}
