import { trpc } from '../trpc'
import { api } from './api'

const viewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    setFilter: builder.mutation({
      query: trpc.table.view.filter.set.mutate,
      invalidatesTags: ['Table'],
    }),
    setSort: builder.mutation({
      query: trpc.table.view.sort.set.mutate,
      invalidatesTags: ['Table'],
    }),
    switchDisplayType: builder.mutation({
      query: trpc.table.view.switchDisplayType.mutate,
      invalidatesTags: ['Table'],
    }),
  }),
  overrideExisting: false,
})

export const { useSetFilterMutation, useSetSortMutation, useSwitchDisplayTypeMutation } = viewApi

const calendarApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setCalendarField: builder.mutation({
      query: trpc.table.view.calendar.setField.mutate,
      invalidatesTags: ['Table'],
    }),
  }),
})

export const { useSetCalendarFieldMutation } = calendarApi

const kanbanApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setKanbanField: builder.mutation({
      query: trpc.table.view.kanban.setField.mutate,
      invalidatesTags: ['Table'],
    }),
  }),
})

export const { useSetKanbanFieldMutation } = kanbanApi

const treeViewApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setTreeField: builder.mutation({
      query: trpc.table.view.tree.setField.mutate,
      invalidatesTags: ['Table'],
    }),
  }),
})

export const { useSetTreeFieldMutation } = treeViewApi

const viewFieldApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setVisibility: builder.mutation({
      query: trpc.table.view.field.setVisibility.mutate,
      invalidatesTags: ['Table'],
    }),
    moveField: builder.mutation({
      query: trpc.table.view.field.move.mutate,
      invalidatesTags: ['Table'],
    }),
    setFieldWidth: builder.mutation({
      query: trpc.table.view.field.setWidth.mutate,
      invalidatesTags: ['Table'],
    }),
  }),
})

export const { useSetVisibilityMutation, useMoveFieldMutation, useSetFieldWidthMutation } = viewFieldApi
