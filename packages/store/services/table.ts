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
      providesTags: ['Table'],
    }),
    getTable: builder.query<IGetTableOutput, IGetTableQuery>({
      query: trpc.table.get.query,
      providesTags: (_, __, args) => [{ type: 'Table', id: args.id }],
    }),
    createTable: builder.mutation<ICreateTableOutput, ICreateTableInput>({
      query: trpc.table.create.mutate,
      invalidatesTags: ['Table'],
    }),
    editTable: builder.mutation({
      query: trpc.table.edit.mutate,
      invalidatesTags: ['Table'],
    }),
    deleteTable: builder.mutation({
      query: trpc.table.delete.mutate,
      invalidatesTags: ['Table'],
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
