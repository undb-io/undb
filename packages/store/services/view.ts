import { trpc } from '../trpc'
import { api } from './api'

const viewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    setFilter: builder.mutation({
      query: trpc.table.view.filter.set.mutate,
      invalidatesTags: ({ tableId }) => [{ type: 'Table', id: tableId }],
    }),
    setSort: builder.mutation({
      query: trpc.table.view.sort.set.mutate,
      invalidatesTags: ({ tableId }) => [{ type: 'Table', id: tableId }],
    }),
    switchDisplayType: builder.mutation({
      query: trpc.table.view.switchDisplayType.mutate,
      invalidatesTags: ({ tableId }) => [{ type: 'Table', id: tableId }],
    }),
  }),
  overrideExisting: false,
})

export const { useSetFilterMutation, useSetSortMutation, useSwitchDisplayTypeMutation } = viewApi

const calendarApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setCalendarField: builder.mutation({
      query: trpc.table.view.calendar.setField.mutate,
      invalidatesTags: ({ tableId }) => [{ type: 'Table', id: tableId }],
    }),
  }),
})

export const { useSetCalendarFieldMutation } = calendarApi

const kanbanApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setKanbanField: builder.mutation({
      query: trpc.table.view.kanban.setField.mutate,
      invalidatesTags: ({ tableId }) => [{ type: 'Table', id: tableId }],
    }),
  }),
})

export const { useSetKanbanFieldMutation } = kanbanApi

const treeViewApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setTreeField: builder.mutation({
      query: trpc.table.view.tree.setField.mutate,
      invalidatesTags: ({ tableId }) => [{ type: 'Table', id: tableId }],
    }),
  }),
})

export const { useSetTreeFieldMutation } = treeViewApi

const viewFieldApi = viewApi.injectEndpoints({
  endpoints: (builder) => ({
    setVisibility: builder.mutation({
      query: trpc.table.view.field.setVisibility.mutate,
      invalidatesTags: ({ tableId }) => [{ type: 'Table', id: tableId }],
    }),
    moveField: builder.mutation({
      query: trpc.table.view.field.move.mutate,
      invalidatesTags: ({ tableId }) => [{ type: 'Table', id: tableId }],
    }),
    setFieldWidth: builder.mutation({
      query: trpc.table.view.field.setWidth.mutate,
      invalidatesTags: ({ tableId }) => [{ type: 'Table', id: tableId }],
    }),
  }),
})

export const { useSetVisibilityMutation, useMoveFieldMutation, useSetFieldWidthMutation } = viewFieldApi
