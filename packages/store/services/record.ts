import type {
  IGetParentAvailableRecordQuery,
  IGetParentAvailableRecordsOutput,
  IGetRecordsOutput,
  IGetRecordsQuery,
  IGetRecordsTreeOutput,
  IGetRecordsTreeQuery,
  IGetTreeAvailableRecordsOutput,
  IGetTreeAvailableRecordsQuery,
  IUpdateRecordCommandInput,
} from '@egodb/core'
import { trpc } from '../trpc'
import { api } from './api'

const recordApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecords: builder.query<IGetRecordsOutput, IGetRecordsQuery>({
      query: trpc.record.list.query,
      providesTags: ['Record'],
    }),
    listTree: builder.query<IGetRecordsTreeOutput, IGetRecordsTreeQuery>({
      query: trpc.record.tree.list.query,
      providesTags: ['Record'],
    }),
    treeAvailable: builder.query<IGetTreeAvailableRecordsOutput, IGetTreeAvailableRecordsQuery>({
      query: trpc.record.tree.available.query,
      providesTags: ['Record'],
    }),
    parentAvailable: builder.query<IGetParentAvailableRecordsOutput, IGetParentAvailableRecordQuery>({
      query: trpc.record.parent.available.query,
      providesTags: ['Record'],
    }),
    createRecord: builder.mutation({
      query: trpc.record.create.mutate,
      invalidatesTags: ['Record'],
    }),
    updateRecord: builder.mutation<void, IUpdateRecordCommandInput>({
      query: trpc.record.update.mutate,
      invalidatesTags: ['Record'],
    }),
    dulicateRecord: builder.mutation({
      query: trpc.record.duplicate.mutate,
      invalidatesTags: ['Record'],
    }),
    deleteRecord: builder.mutation({
      query: trpc.record.delete.mutate,
      invalidatesTags: ['Record'],
    }),
  }),
})

export const {
  useGetRecordsQuery,
  useLazyGetRecordsQuery,
  useListTreeQuery,
  useParentAvailableQuery,
  useLazyParentAvailableQuery,
  useTreeAvailableQuery,
  useLazyTreeAvailableQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDulicateRecordMutation,
  useDeleteRecordMutation,
} = recordApi
