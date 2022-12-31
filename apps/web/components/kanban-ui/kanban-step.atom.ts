import { atom } from 'jotai'

export const stepAtom = atom(0)

export const stepOne = atom(null, (_, set) => set(stepAtom, 1))
export const stepZero = atom(null, (_, set) => set(stepAtom, 0))
