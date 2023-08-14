import {
  AcceptInvitationCommand,
  CancelInvitationCommand,
  GetInvitationByIdQuery,
  GetInvitationsQuery,
  InviteCommand,
  ReInviteCommand,
  acceptInvitationCommandInput,
  cancelInvitationCommandInput,
  getInvitationByIdQueryOutput,
  getInvitationByIdQuerySchema,
  getInvitationsQueryOutput,
  getInvitationsQuerySchema,
  inviteCommandInput,
  reinviteCommandInput,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc.js'
import { authz } from './authz.middleware.js'

export const createInvitationRouter =
  (authedProcedure: typeof publicProcedure, procedure: typeof publicProcedure) =>
  (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      get: publicProcedure
        .input(getInvitationByIdQuerySchema)
        .output(getInvitationByIdQueryOutput)
        .query(({ input }) => {
          const query = new GetInvitationByIdQuery(input)
          return queryBus.execute(query)
        }),
      list: authedProcedure
        .use(authz('invitation:list'))
        .input(getInvitationsQuerySchema)
        .output(getInvitationsQueryOutput)
        .query(({ input }) => {
          const query = new GetInvitationsQuery(input)
          return queryBus.execute(query)
        }),
      invite: authedProcedure
        .use(authz('invitation:invite'))
        .input(inviteCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new InviteCommand(input)
          return commandBus.execute(cmd)
        }),
      reinvite: authedProcedure
        .use(authz('invitation:invite'))
        .input(reinviteCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new ReInviteCommand(input)
          return commandBus.execute(cmd)
        }),
      cancel: authedProcedure
        .use(authz('invitation:cancel'))
        .input(cancelInvitationCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new CancelInvitationCommand(input)
          return commandBus.execute(cmd)
        }),
      accept: publicProcedure
        .input(acceptInvitationCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new AcceptInvitationCommand(input)
          return commandBus.execute(cmd)
        }),
    })
