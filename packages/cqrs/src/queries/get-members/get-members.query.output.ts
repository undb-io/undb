import { queryMember } from '@undb/authz'
import { z } from 'zod'

export const getMembersQueryOutput = z.object({
  members: queryMember.array(),
})
