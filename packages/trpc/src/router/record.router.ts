import '@undb/core'
import type { IGetForeignRecordsOutput, IGetRecordOutput, IGetRecordsOutput } from '@undb/cqrs'
import {
  BulkDeleteRecordsCommand,
  BulkDuplicateRecordsCommand,
  CreateRecordCommand,
  CreateRecordsCommand,
  DeleteRecordCommand,
  DuplicateRecordCommand,
  GetForeignRecordsQuery,
  GetRecordQuery,
  GetRecordsQuery,
  RestoreRecordCommand,
  UpdateRecordCommand,
  bulkDeleteRecordsCommandInput,
  bulkDuplicateRecordsCommandInput,
  createRecordCommandOutput,
  deleteRecordCommandInput,
  duplicateRecordCommandInput,
  getForeignRecordsQueryInput,
  getRecordQueryInput,
  getRecordsQueryInput,
  restoreRecordCommandInput,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { createRecordAuditRouter } from './audit.router.js'
import { authz } from './authz.middleware.js'
import { createParentFieldRouter } from './parent-field.router.js'
import { createRecordTrashRouter } from './record-trash.router.js'
import { createTreeFieldRouter } from './tree-field.router.js'

export const createRecordRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      create: procedure
        .use(authz('record:create'))
        .input(z.any())
        .output(createRecordCommandOutput)
        .mutation(({ input }) => {
          const cmd = new CreateRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      buldCreate: procedure
        .use(authz('record:create'))
        .input(z.any())
        .output(z.any())
        .mutation(({ input }) => {
          const cmd = new CreateRecordsCommand(input)
          return commandBus.execute(cmd)
        }),
      duplicate: procedure
        .use(authz('record:create'))
        .input(duplicateRecordCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new DuplicateRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      bulkDuplicate: procedure
        .use(authz('record:create'))
        .input(bulkDuplicateRecordsCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new BulkDuplicateRecordsCommand(input)
          return commandBus.execute(cmd)
        }),
      update: procedure
        .use(authz('record:update'))
        .input(z.any())
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new UpdateRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      delete: procedure
        .use(authz('record:delete'))
        .input(deleteRecordCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new DeleteRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      restore: procedure
        .use(authz('record:create'))
        .input(restoreRecordCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new RestoreRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      bulkDelete: procedure
        .use(authz('record:delete'))
        .input(bulkDeleteRecordsCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new BulkDeleteRecordsCommand(input)
          return commandBus.execute(cmd)
        }),
      get: procedure
        .input(getRecordQueryInput)
        .output(z.any())
        .query<IGetRecordOutput>(({ input }) => {
          const query = new GetRecordQuery(input)
          return queryBus.execute(query)
        }),
      list: procedure
        .input(getRecordsQueryInput)
        .output(z.any())
        .query<IGetRecordsOutput>(({ input }) => {
          const query = new GetRecordsQuery(input)
          return queryBus.execute(query)
        }),
      foreign: procedure
        .input(getForeignRecordsQueryInput)
        .output(z.any())
        .query<IGetForeignRecordsOutput>(({ input }) => {
          const query = new GetForeignRecordsQuery(input)
          return queryBus.execute(query)
        }),
      tree: createTreeFieldRouter(procedure)(queryBus),
      parent: createParentFieldRouter(procedure)(queryBus),
      audit: createRecordAuditRouter(procedure)(commandBus, queryBus),
      trash: createRecordTrashRouter(procedure)(commandBus, queryBus),
    })
