import {
  CreateBaseCommand,
  DeleteBaseCommand,
  GetBaseByIdQuery,
  GetBasesQuery,
  MoveToBaseCommand,
  UpdateBaseCommand,
  createBaseCommandInput,
  deleteBaseCommandInput,
  getBaseByIdQueryInput,
  getBaseByIdQueryOutput,
  getBasesQueryInput,
  getBasesQueryOutput,
  moveToBaseCommandInput,
  updateBaseCommandInput,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createBaseRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
  router({
    list: procedure
      .input(getBasesQueryInput)
      .output(getBasesQueryOutput)
      .query(({ input }) => {
        const query = new GetBasesQuery(input)
        return queryBus.execute(query)
      }),
    getById: procedure
      .input(getBaseByIdQueryInput)
      .output(getBaseByIdQueryOutput)
      .query(({ input }) => {
        const query = new GetBaseByIdQuery(input)
        return queryBus.execute(query)
      }),
    create: procedure
      .input(createBaseCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateBaseCommand(input)
        return commandBus.execute(cmd)
      }),
    update: procedure
      .input(updateBaseCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new UpdateBaseCommand(input)
        return commandBus.execute(cmd)
      }),
    delete: procedure
      .input(deleteBaseCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new DeleteBaseCommand(input)
        return commandBus.execute(cmd)
      }),
    moveToBase: procedure
      .input(moveToBaseCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new MoveToBaseCommand(input)
        return commandBus.execute(cmd)
      }),
  })
