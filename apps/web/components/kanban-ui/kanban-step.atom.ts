import { atom } from 'jotai'

export const stepAtom = atom(0)

export const stepOneAtom = atom(null, (_, set) => set(stepAtom, 1))
export const stepZeroAtom = atom(null, (_, set) => set(stepAtom, 0))
