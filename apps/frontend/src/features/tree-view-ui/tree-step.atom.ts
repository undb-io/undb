import { atom } from 'jotai'

export const treeStepAtom = atom(0)

export const treeStepZeroAtom = atom(null, (_, set) => set(treeStepAtom, 0))
export const treeStepOneAtom = atom(null, (_, set) => set(treeStepAtom, 1))
