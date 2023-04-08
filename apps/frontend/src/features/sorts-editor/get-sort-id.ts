import type { ISortSchema } from '@undb/core'

export const getSortId = (sort: ISortSchema | null, index: number) => (sort?.fieldId ?? '') + index
