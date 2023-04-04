import { atom } from 'jotai'

export const kanbanStepAtom = atom(0)

export const kanbanStepZeroAtom = atom(null, (_, set) => set(kanbanStepAtom, 0))
export const kanbanStepOneAtom = atom(null, (_, set) => set(kanbanStepAtom, 1))
export const kanbanStepTwoAtom = atom(null, (_, set) => set(kanbanStepAtom, 2))
