import { atom } from 'jotai'

export const openCalendarEditFieldAtom = atom(false)

export const openCalendarEditField = atom(null, (_, set) => set(openCalendarEditFieldAtom, true))
