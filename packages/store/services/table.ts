import type {
  ICreateTableInput,
  ICreateTableOutput,
  IGetTableOutput,
  IGetTableQuery,
  IGetTablesOutput,
  IGetTablesQuery,
} from '@egodb/core'
import { trpc } from '../trpc'
import { api } from './api'

const tableApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTables: builder.query<IGetTablesOutput, IGetTablesQuery>({
      query: trpc.table.list.query,
    }),
    getTable: builder.query<IGetTableOutput, IGetTableQuery>({
      query: trpc.table.get.query,
    }),
    createTable: builder.mutation<ICreateTableOutput, ICreateTableInput>({
      query: trpc.table.create.mutate,
    }),
    editTable: builder.mutation({
      query: trpc.table.edit.mutate,
    }),
    deleteTable: builder.mutation({
      query: trpc.table.delete.mutate,
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetTablesQuery,
  useGetTableQuery,
  useCreateTableMutation,
  useEditTableMutation,
  useDeleteTableMutation,
} = tableApi
