import '@undb/core'
import {
  BulkDeleteRecordsCommand,
  bulkDeleteRecordsCommandInput,
  BulkDuplicateRecordsCommand,
  bulkDuplicateRecordsCommandInput,
  CreateRecordCommand,
  createRecordCommandOutput,
  DeleteRecordCommand,
  deleteRecordCommandInput,
  DuplicateRecordCommand,
  duplicateRecordCommandInput,
  GetForeignRecordsQuery,
  getForeignRecordsQueryInput,
  GetRecordQuery,
  getRecordQueryInput,
  GetRecordsQuery,
  getRecordsQueryInput,
  UpdateRecordCommand,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { createParentFieldRouter } from './parent-field.router.js'
import { createTreeFieldRouter } from './tree-field.router.js'

export const createRecordRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      create: procedure
        .input(z.any())
        .output(createRecordCommandOutput)
        .mutation(({ input }) => {
          const cmd = new CreateRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      duplicate: procedure
        .input(duplicateRecordCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new DuplicateRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      bulkDuplicate: procedure
        .input(bulkDuplicateRecordsCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new BulkDuplicateRecordsCommand(input)
          return commandBus.execute(cmd)
        }),
      update: procedure
        .input(z.any())
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new UpdateRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      delete: procedure
        .input(deleteRecordCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new DeleteRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      bulkDelete: procedure
        .input(bulkDeleteRecordsCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new BulkDeleteRecordsCommand(input)
          return commandBus.execute(cmd)
        }),
      get: procedure
        .input(getRecordQueryInput)
        .output(z.any())
        .query(({ input }) => {
          const query = new GetRecordQuery(input)
          return queryBus.execute(query)
        }),
      list: procedure
        .input(getRecordsQueryInput)
        .output(z.any())
        .query(({ input }) => {
          const query = new GetRecordsQuery(input)
          return queryBus.execute(query)
        }),
      foreign: procedure
        .input(getForeignRecordsQueryInput)
        .output(z.any())
        .query(({ input }) => {
          const query = new GetForeignRecordsQuery(input)
          return queryBus.execute(query)
        }),
      tree: createTreeFieldRouter(procedure)(queryBus),
      parent: createParentFieldRouter(procedure)(queryBus),
    })
