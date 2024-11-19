import { Scope } from "@undb/table"
import {
  addDays,
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
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

interface CalendarState {
  selectedDate: Date
  dates: Date[]
  weekDates: Date[]
  scope: Writable<Scope>

  isDragging: boolean
}

export const createCalendarStore = () => {
  const generateDatesInMonth = (date: Date): Date[] => {
    const monthStart = startOfMonth(date)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })

    // 生成 35 天的日期数组 (5x7)
    return eachDayOfInterval({
      start: calendarStart,
      end: addDays(calendarStart, 34),
    })
  }

  const generateWeekDates = (date: Date): Date[] => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
    return eachDayOfInterval({
      start: weekStart,
      end: weekEnd,
    })
  }

  const now = new Date()
  const { subscribe, set, update } = writable<CalendarState>({
    selectedDate: now,
    dates: generateDatesInMonth(now),
    weekDates: generateWeekDates(now),
    scope: persisted("calendar-scope", "thisMonth"),
    isDragging: false,
  })

  const store = {
    subscribe,
    setScope: (scope: Scope) => {
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
        selectedDate: targetDate,
        dates: generateDatesInMonth(targetDate),
        weekDates: generateWeekDates(targetDate),
      }))
    },
    nextDay: () => {
      update((state) => {
        const nextDate = addDays(state.selectedDate, 1)
        return {
          ...state,
          selectedDate: nextDate,
          dates: generateDatesInMonth(nextDate),
          weekDates: generateWeekDates(nextDate),
        }
      })
    },
    prevDay: () => {
      update((state) => {
        const prevDate = addDays(state.selectedDate, -1)
        return {
          ...state,
          selectedDate: prevDate,
          dates: generateDatesInMonth(prevDate),
          weekDates: generateWeekDates(prevDate),
        }
      })
    },
    nextMonth: () => {
      update((state) => {
        const nextDate = addMonths(state.selectedDate, 1)
        return {
          ...state,
          selectedDate: nextDate,
          dates: generateDatesInMonth(nextDate),
          weekDates: generateWeekDates(nextDate),
        }
      })
    },
    prevMonth: () => {
      update((state) => {
        const prevDate = subMonths(state.selectedDate, 1)
        return {
          ...state,
          selectedDate: prevDate,
          dates: generateDatesInMonth(prevDate),
          weekDates: generateWeekDates(prevDate),
        }
      })
    },
    prevYear: () => {
      update((state) => {
        const prevDate = subYears(state.selectedDate, 1)
        return {
          ...state,
          selectedDate: prevDate,
          dates: generateDatesInMonth(prevDate),
          weekDates: generateWeekDates(prevDate),
        }
      })
    },
    nextYear: () => {
      update((state) => {
        const nextDate = addYears(state.selectedDate, 1)
        return {
          ...state,
          selectedDate: nextDate,
          dates: generateDatesInMonth(nextDate),
          weekDates: generateWeekDates(nextDate),
        }
      })
    },
    reset: () => {
      const today = new Date()
      update((state) => ({
        ...state,
        selectedDate: today,
        dates: generateDatesInMonth(today),
        weekDates: generateWeekDates(today),
      }))
    },
    setIsDragging: (isDragging: boolean) => {
      update((state) => ({
        ...state,
        isDragging,
      }))
    },
    setSelectedDate: (date: Date) => {
      update((state) => ({
        ...state,
        selectedDate: date,
      }))
    },
    nextWeek: () => {
      update((state) => {
        const nextDate = addDays(state.selectedDate, 7)
        return {
          ...state,
          selectedDate: nextDate,
          dates: generateDatesInMonth(nextDate),
          weekDates: generateWeekDates(nextDate),
        }
      })
    },
    prevWeek: () => {
      update((state) => {
        const prevDate = addDays(state.selectedDate, -7)
        return {
          ...state,
          selectedDate: prevDate,
          dates: generateDatesInMonth(prevDate),
          weekDates: generateWeekDates(prevDate),
        }
      })
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
    return startOfMonth($calendar.selectedDate)
  })

  const endOfMonthTimestamp = derived(store, ($calendar) => {
    if ($calendar.dates.length === 0) return null
    return endOfMonth($calendar.selectedDate)
  })

  const startOfDayTimestamp = derived(store, ($calendar) => {
    if (!$calendar.selectedDate) return null
    return startOfDay($calendar.selectedDate)
  })

  const endOfDayTimestamp = derived(store, ($calendar) => {
    if (!$calendar.selectedDate) return null
    return endOfDay($calendar.selectedDate)
  })

  const startOfWeekTimestamp = derived(store, ($calendar) => {
    if (!$calendar.selectedDate) return null
    return startOfWeek($calendar.selectedDate, { weekStartsOn: 1 })
  })

  const endOfWeekTimestamp = derived(store, ($calendar) => {
    if (!$calendar.selectedDate) return null
    return endOfWeek($calendar.selectedDate, { weekStartsOn: 1 })
  })

  const currentYear = derived(store, ($calendar) => {
    return getYear($calendar.selectedDate)
  })

  const currentMonth = derived(store, ($calendar) => {
    return getMonth($calendar.selectedDate) + 1
  })

  const isSelected = derived(
    store,
    ($calendar) => (date: Date) => !!$calendar.selectedDate && isSameDay(date, $calendar.selectedDate),
  )

  const getIsSameMonth = derived(store, ($calendar) => (date: Date) => {
    return isSameMonth(date, $calendar.selectedDate)
  })

  const weekStart = derived(store, ($calendar) => startOfWeek($calendar.selectedDate, { weekStartsOn: 1 }))

  const weekEnd = derived(store, ($calendar) => endOfWeek($calendar.selectedDate, { weekStartsOn: 1 }))

  return {
    ...store,
    startTimestamp,
    endTimestamp,
    startOfMonthTimestamp,
    endOfMonthTimestamp,
    startOfDayTimestamp,
    endOfDayTimestamp,
    startOfWeekTimestamp,
    endOfWeekTimestamp,
    currentYear,
    currentMonth,
    isSelected,
    getIsSameMonth,
    weekStart,
    weekEnd,
  }
}

export const calendarStore = createCalendarStore()

export const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function formatHour(hour: number) {
  const ampm = hour >= 12 ? "pm" : "am"
  const h = hour % 12 || 12
  return `${h} ${ampm}`
}
