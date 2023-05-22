import type { Record } from '@undb/core'

export type TreeRecord = {
	id: string
	record: Record
	children: TreeRecord[]
}
