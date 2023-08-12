import {
  GetInvitationsQuery,
  InviteCommand,
  ReInviteCommand,
  getInvitationsQueryOutput,
  getInvitationsQuerySchema,
  inviteCommandInput,
  reinviteCommandInput,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

export const createInvitationRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      list: procedure
        .use(authz('invitation:list'))
        .input(getInvitationsQuerySchema)
        .output(getInvitationsQueryOutput)
        .query(({ input }) => {
          const query = new GetInvitationsQuery(input)
          return queryBus.execute(query)
        }),
      invite: procedure
        .use(authz('invitation:invite'))
        .input(inviteCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new InviteCommand(input)
          return commandBus.execute(cmd)
        }),
      reinvite: procedure
        .use(authz('invitation:invite'))
        .input(reinviteCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new ReInviteCommand(input)
          return commandBus.execute(cmd)
        }),
    })
