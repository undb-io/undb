import type {
  IGetShareAggregateChartOutput,
  IGetShareAggregateNumberOutput,
  IGetShareViewRecordOutput,
  IGetShareViewRecordsOutput,
  IGetShareViewTreeRecordsOutput,
  IGetSharedViewOutput,
} from '@undb/cqrs'
import {
  CreateShareCommand,
  GetShareAggregateChartQuery,
  GetShareAggregateNumberQuery,
  GetShareQuery,
  GetShareViewRecordQuery,
  GetShareViewRecordsQuery,
  GetShareViewTreeRecordsQuery,
  GetSharedViewQuery,
  createShareCommandInput,
  getShareAggregateChartQuerySchema,
  getShareAggregateNumberQuerySchema,
  getShareQueryInput,
  getShareQueryOutput,
  getShareViewRecordQueryInput,
  getShareViewRecordsQueryInput,
  getShareViewTreeRecordsQueryInput,
  getSharedViewQueryInput,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createShareRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      view: procedure
        .input(getSharedViewQueryInput)
        .output(z.any())
        .query<IGetSharedViewOutput>(({ input }) => {
          const query = new GetSharedViewQuery(input)
          return queryBus.execute(query)
        }),
      viewRecord: procedure
        .input(getShareViewRecordQueryInput)
        .output(z.any())
        .query<IGetShareViewRecordOutput>(({ input }) => {
          const query = new GetShareViewRecordQuery(input)
          return queryBus.execute(query)
        }),
      viewRecords: procedure
        .input(getShareViewRecordsQueryInput)
        .output(z.any())
        .query<IGetShareViewRecordsOutput>(({ input }) => {
          const query = new GetShareViewRecordsQuery(input)
          return queryBus.execute(query)
        }),
      viewTreeRecords: procedure
        .input(getShareViewTreeRecordsQueryInput)
        .output(z.any())
        .query<IGetShareViewTreeRecordsOutput>(({ input }) => {
          const query = new GetShareViewTreeRecordsQuery(input)
          return queryBus.execute(query)
        }),
      viewAggregateNumber: procedure
        .input(getShareAggregateNumberQuerySchema)
        .output(z.any())
        .query<IGetShareAggregateNumberOutput>(({ input }) => {
          const query = new GetShareAggregateNumberQuery(input)
          return queryBus.execute(query)
        }),
      viewAggregateChart: procedure
        .input(getShareAggregateChartQuerySchema)
        .output(z.any())
        .query<IGetShareAggregateChartOutput>(({ input }) => {
          const query = new GetShareAggregateChartQuery(input)
          return queryBus.execute(query)
        }),
      get: procedure
        .input(getShareQueryInput)
        .output(getShareQueryOutput)
        .query(({ input }) => {
          const query = new GetShareQuery(input)
          return queryBus.execute(query)
        }),
      create: procedure
        .input(createShareCommandInput)
        .output(z.any())
        .mutation(({ input }) => {
          const cmd = new CreateShareCommand(input)
          return commandBus.execute(cmd)
        }),
    })
