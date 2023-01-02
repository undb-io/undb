import type { ICreateFieldValueObject } from '@egodb/core'
import { atom } from 'jotai'

export const createRecordInitialValueAtom = atom<ICreateFieldValueObject>({})
