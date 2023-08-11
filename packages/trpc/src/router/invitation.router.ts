import { InviteCommand, inviteCommandInput } from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

export const createInvitationRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      invite: procedure
        .use(authz('invitation:invite'))
        .input(inviteCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new InviteCommand(input)
          return commandBus.execute(cmd)
        }),
    })
