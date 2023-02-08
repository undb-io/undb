import type {
  IFieldQueryValue,
  IGetParentAvailableRecordQuery,
  IGetRecordOutput,
  IGetRecordQuery,
  IGetRecordsOutput,
  IGetRecordsQuery,
  IGetRecordsTreeOutput,
  IGetRecordsTreeQuery,
  IGetTreeAvailableRecordsQuery,
  IQueryRecordSchema,
  IUpdateRecordCommandInput,
} from '@egodb/core'
import type { EntityState } from '@reduxjs/toolkit'
import { createEntityAdapter } from '@reduxjs/toolkit'
import { trpc } from '../trpc'
import { api } from './api'

const recordAdapter = createEntityAdapter<IQueryRecordSchema>()
const initialState = recordAdapter.getInitialState()

type QueryRecordsEntity = EntityState<IQueryRecordSchema>

const providesTags = (result: QueryRecordsEntity | undefined) => [
  'Record' as const,
  ...(result?.ids?.map((id) => ({ type: 'Record' as const, id })) ?? []),
]
const transformResponse = (result: IGetRecordsOutput) => recordAdapter.setAll(initialState, result.records)

export const recordApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecords: builder.query<QueryRecordsEntity, IGetRecordsQuery>({
      query: trpc.record.list.query,
      providesTags,
      transformResponse,
    }),
    getRecord: builder.query<IGetRecordOutput, IGetRecordQuery>({
      query: trpc.record.get.query,
      providesTags: (_, __, { id }) => [{ type: 'Record', id }],
    }),
    listTree: builder.query<IGetRecordsTreeOutput, IGetRecordsTreeQuery>({
      query: trpc.record.tree.list.query,
      providesTags: ['TreeRecord'],
    }),
    treeAvailable: builder.query<QueryRecordsEntity, IGetTreeAvailableRecordsQuery>({
      query: trpc.record.tree.available.query,
      providesTags,
      transformResponse,
    }),
    parentAvailable: builder.query<QueryRecordsEntity, IGetParentAvailableRecordQuery>({
      query: trpc.record.parent.available.query,
      providesTags,
      transformResponse,
    }),
    createRecord: builder.mutation({
      query: trpc.record.create.mutate,
      invalidatesTags: ['Record', 'TreeRecord'],
    }),
    updateRecord: builder.mutation<void, IUpdateRecordCommandInput>({
      query: trpc.record.update.mutate,
      onQueryStarted({ id, tableId, value }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          recordApi.util.updateQueryData('getRecords', { tableId }, (draft) => {
            const origin = draft.entities[id]
            if (origin) {
              const newValues = value.reduce((prev, curr) => {
                prev[curr.id] = curr.value
                return prev
              }, {} as Record<string, IFieldQueryValue>)
              const values = Object.assign(origin.values, newValues)
              draft.entities[id] = {
                ...origin,
                values,
                updatedAt: new Date(),
              }
            }
          }),
        )
        queryFulfilled.catch(patchResult.undo)
      },
    }),
    duplicateRecord: builder.mutation({
      query: trpc.record.duplicate.mutate,
      invalidatesTags: ['Record'],
    }),
    bulkDuplicateRecord: builder.mutation({
      query: trpc.record.bulkDuplicate.mutate,
      invalidatesTags: ['Record'],
    }),
    deleteRecord: builder.mutation({
      query: trpc.record.delete.mutate,
      onQueryStarted({ id, tableId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          recordApi.util.updateQueryData('getRecords', { tableId }, (draft) => {
            delete draft.entities[id]
          }),
        )
        queryFulfilled.catch(patchResult.undo)
      },
    }),
    BulkDeleteRecords: builder.mutation({
      query: trpc.record.bulkDelete.mutate,
      onQueryStarted({ ids, tableId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          recordApi.util.updateQueryData('getRecords', { tableId }, (draft) => {
            for (const id of ids) {
              delete draft.entities[id]
            }
          }),
        )
        queryFulfilled.catch(patchResult.undo)
      },
    }),
  }),
})

export const {
  useGetRecordsQuery,
  useGetRecordQuery,
  useLazyGetRecordsQuery,
  useListTreeQuery,
  useParentAvailableQuery,
  useLazyParentAvailableQuery,
  useTreeAvailableQuery,
  useLazyTreeAvailableQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDuplicateRecordMutation,
  useBulkDuplicateRecordMutation,
  useDeleteRecordMutation,
  useBulkDeleteRecordsMutation,
} = recordApi
