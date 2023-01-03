import { atom } from 'jotai'

export const calendarStep = atom(0)

export const calendarStepZero = atom(null, (get, set) => set(calendarStep, 0))
export const calendarStepOne = atom(null, (get, set) => set(calendarStep, 1))
export const calendarStepTwo = atom(null, (get, set) => set(calendarStep, 2))
