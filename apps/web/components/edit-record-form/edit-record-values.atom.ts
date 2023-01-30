import type { RecordValueJSON } from '@egodb/core'
import { atomWithReset } from 'jotai/utils'

export const editRecordValuesAtom = atomWithReset<{ id: string; values: RecordValueJSON } | null>(null)
