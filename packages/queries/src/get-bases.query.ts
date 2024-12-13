import { baseDTO } from "@undb/base"
import { Query } from "@undb/domain"
import { z } from "@undb/zod"

export const getBasesQuery = z.void()

export type IGetBasesQuery = z.infer<typeof getBasesQuery>

export const getBasesQueryOutput = baseDTO.array()

export type IGetBasesQueryOutput = z.infer<typeof getBasesQueryOutput>

export class GetBasesQuery extends Query {}
