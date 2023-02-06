import { trpc } from '../trpc'
import { api } from './api'

const viewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    setFilter: builder.mutation({
      query: trpc.table.view.filter.set.mutate,
    }),
    setSort: builder.mutation({
      query: trpc.table.view.sort.set.mutate,
    }),
    switchDisplayType: builder.mutation({
      query: trpc.table.view.switchDisplayType.mutate,
    }),
  }),
  overrideExisting: false,
})

export const { useSetFilterMutation, useSetSortMutation, useSwitchDisplayTypeMutation } = viewApi

const calendarApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setField: builder.mutation({
      query: trpc.table.view.calendar.setField.mutate,
    }),
  }),
})

export const { useSetFieldMutation: useSetCalendarFieldMutation } = calendarApi

const kanbanApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setField: builder.mutation({
      query: trpc.table.view.kanban.setField.mutate,
    }),
  }),
})

export const { useSetFieldMutation: useSetKanbanFieldMutation } = kanbanApi

const treeViewApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setField: builder.mutation({
      query: trpc.table.view.tree.setField.mutate,
    }),
  }),
})

export const { useSetFieldMutation: useSetTreeFieldMutation } = treeViewApi

const viewFieldApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setVisibility: builder.mutation({
      query: trpc.table.view.field.setVisibility.mutate,
    }),
    moveField: builder.mutation({
      query: trpc.table.view.field.move.mutate,
    }),
    setFieldWidth: builder.mutation({
      query: trpc.table.view.field.setWidth.mutate,
    }),
  }),
})

export const { useSetVisibilityMutation, useMoveFieldMutation, useSetFieldWidthMutation } = viewFieldApi
