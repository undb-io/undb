import { atomWithReset } from 'jotai/utils'

export const activeFieldAtom = atomWithReset<string | null>(null)
