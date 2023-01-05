import type { RecordValueJSON } from '@egodb/core'
import { atom } from 'jotai'

export const editRecordValuesAtom = atom<{ id: string; values: RecordValueJSON } | null>(null)
