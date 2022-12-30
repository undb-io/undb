import { z } from 'zod'

const $and = z.literal('$and')
const $or = z.literal('$or')
const $not = z.literal('$not')
export const conjunctions = z.union([$and, $or, $not])
export type IConjunction = z.infer<typeof conjunctions>
