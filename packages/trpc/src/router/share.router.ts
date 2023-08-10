import type {
  IGetShareAggregateChartOutput,
  IGetShareAggregateNumberOutput,
  IGetShareViewRecordOutput,
  IGetShareViewRecordsOutput,
  IGetShareViewTreeRecordsOutput,
  IGetSharedTableOutput,
} from '@undb/cqrs'
import {
  CreateShareCommand,
  CreateShareRecordCommand,
  GetShareAggregateChartQuery,
  GetShareAggregateNumberQuery,
  GetShareQuery,
  GetShareViewRecordQuery,
  GetShareViewRecordsQuery,
  GetShareViewTreeRecordsQuery,
  GetSharedTableQuery,
  UpdateShareCommand,
  createShareCommandInput,
  createShareRecordCommandOutput,
  getShareAggregateChartQuerySchema,
  getShareAggregateNumberQuerySchema,
  getShareQueryInput,
  getShareQueryOutput,
  getShareViewRecordQueryInput,
  getShareViewRecordsQueryInput,
  getShareViewTreeRecordsQueryInput,
  getSharedTableQueryInput,
  updateShareCommandInput,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

export const createShareRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      table: procedure
        .input(getSharedTableQueryInput)
        .output(z.any())
        .query<IGetSharedTableOutput>(({ input }) => {
          const query = new GetSharedTableQuery(input)
          return queryBus.execute(query)
        }),
      createRecord: procedure
        .input(z.any())
        .output(createShareRecordCommandOutput)
        .mutation(({ input }) => {
          const cmd = new CreateShareRecordCommand(input)
          return commandBus.execute(cmd)
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
        .use(authz('share:enable'))
        .input(createShareCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new CreateShareCommand(input)
          return commandBus.execute(cmd)
        }),
      update: procedure
        .use(authz('share:enable'))
        .input(updateShareCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new UpdateShareCommand(input)
          return commandBus.execute(cmd)
        }),
    })
