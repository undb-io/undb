import { atom } from 'jotai'

export const openKanbanEditFieldAtom = atom(false)

export const openKanbanEditField = atom(null, (_, set) => set(openKanbanEditFieldAtom, true))
