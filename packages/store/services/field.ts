import { trpc } from '../trpc'
import { api } from './api'

const fieldApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createField: builder.mutation({
      query: trpc.table.field.create.mutate,
    }),
    deleteField: builder.mutation({
      query: trpc.table.field.delete.mutate,
    }),
  }),
})

export const { useCreateFieldMutation, useDeleteFieldMutation } = fieldApi

const selectApi = fieldApi.injectEndpoints({
  endpoints: (builder) => ({
    createOption: builder.mutation({
      query: trpc.table.field.select.createOption.mutate,
    }),
    updateOption: builder.mutation({
      query: trpc.table.field.select.updateOption.mutate,
    }),
    deleteOption: builder.mutation({
      query: trpc.table.field.select.deleteOption.mutate,
    }),
    reorderOptions: builder.mutation({
      query: trpc.table.field.select.reorderOptions.mutate,
    }),
  }),
})

export const { useCreateOptionMutation, useUpdateOptionMutation, useDeleteOptionMutation, useReorderOptionsMutation } =
  selectApi
