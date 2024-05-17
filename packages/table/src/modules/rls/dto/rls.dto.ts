import { tableRLS } from "../table-rls.vo"

export const rlsDTO = tableRLS.optional()

export type IRlsDTO = typeof rlsDTO
