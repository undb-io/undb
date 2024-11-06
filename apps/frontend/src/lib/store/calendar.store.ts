import {
  addDays,
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  getMonth,
  getYear,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
} from "date-fns"
import { persisted } from "svelte-persisted-store"
import { derived, Writable, writable } from "svelte/store"

export type MonthScope = "selectedDate" | "withoutDate" | "thisMonth" | "allRecords"

interface CalendarState {
  currentDate: Date
  selectedDate?: Date
  dates: Date[]
  scope: Writable<MonthScope>

  isDragging: boolean
}

export const createCalendarMonthStore = () => {
  const generateDates = (date: Date): Date[] => {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })

    // 生成 35 天的日期数组 (5x7)
    return eachDayOfInterval({
      start: calendarStart,
      end: addDays(calendarStart, 34),
    })
  }

  const now = new Date()
  const { subscribe, set, update } = writable<CalendarState>({
    currentDate: now,
    selectedDate: now,
    dates: generateDates(now),
    scope: persisted("calendar-scope", "thisMonth"),
    isDragging: false,
  })

  const store = {
    subscribe,
    setScope: (scope: MonthScope) => {
      update((state) => {
        state.scope.update((s) => scope)
        return state
      })
    },
    select: (date: Date) => {
      update((state) => ({
        ...state,
        selectedDate: date,
      }))
    },
    setMonth: (date: Date | string | number) => {
      const targetDate = new Date(date)
      update((state) => ({
        ...state,
        currentDate: targetDate,
        dates: generateDates(targetDate),
      }))
    },
    nextMonth: () => {
      update((state) => {
        const nextDate = addMonths(state.currentDate, 1)
        return {
          ...state,
          currentDate: nextDate,
          dates: generateDates(nextDate),
          selectedDate: nextDate,
        }
      })
    },
    prevMonth: () => {
      update((state) => {
        const prevDate = subMonths(state.currentDate, 1)
        return {
          ...state,
          currentDate: prevDate,
          dates: generateDates(prevDate),
          selectedDate: prevDate,
        }
      })
    },
    prevYear: () => {
      update((state) => {
        const prevDate = subYears(state.currentDate, 1)
        return {
          ...state,
          currentDate: prevDate,
          dates: generateDates(prevDate),
          selectedDate: prevDate,
        }
      })
    },
    nextYear: () => {
      update((state) => {
        const nextDate = addYears(state.currentDate, 1)
        return {
          ...state,
          currentDate: nextDate,
          dates: generateDates(nextDate),
          selectedDate: nextDate,
        }
      })
    },
    reset: () => {
      const today = new Date()
      update((state) => ({
        ...state,
        currentDate: today,
        dates: generateDates(today),
        selectedDate: today,
      }))
    },
    setIsDragging: (isDragging: boolean) => {
      update((state) => ({
        ...state,
        isDragging,
      }))
    },
  }

  // 派生 store：获取最早时间戳
  const startTimestamp = derived(store, ($calendar) => {
    if ($calendar.dates.length === 0) return null
    return startOfDay($calendar.dates[0])
  })

  // 派生 store：获取最晚时间戳
  const endTimestamp = derived(store, ($calendar) => {
    if ($calendar.dates.length === 0) return null
    return endOfDay($calendar.dates[$calendar.dates.length - 1])
  })

  const startOfMonthTimestamp = derived(store, ($calendar) => {
    if ($calendar.dates.length === 0) return null
    return startOfMonth($calendar.currentDate)
  })

  const endOfMonthTimestamp = derived(store, ($calendar) => {
    if ($calendar.dates.length === 0) return null
    return endOfMonth($calendar.currentDate)
  })

  const currentYear = derived(store, ($calendar) => {
    return getYear($calendar.currentDate)
  })

  const currentMonth = derived(store, ($calendar) => {
    return getMonth($calendar.currentDate) + 1
  })

  const isSelected = derived(
    store,
    ($calendar) => (date: Date) => !!$calendar.selectedDate && isSameDay(date, $calendar.selectedDate),
  )

  const getIsSameMonth = derived(store, ($calendar) => (date: Date) => {
    return isSameMonth(date, $calendar.currentDate)
  })

  return {
    ...store,
    startTimestamp,
    endTimestamp,
    startOfMonthTimestamp,
    endOfMonthTimestamp,
    currentYear,
    currentMonth,
    isSelected,
    getIsSameMonth,
  }
}

export const monthStore = createCalendarMonthStore()
