import type { IQueryRecordSchema } from '@egodb/core'
import { atom } from 'jotai'

export const editRecordValuesAtom = atom<Pick<IQueryRecordSchema, 'id' | 'values'> | null>(null)
