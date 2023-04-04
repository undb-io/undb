import type { ISortSchema } from '@egodb/core'

export const getSortId = (sort: ISortSchema | null, index: number) => (sort?.fieldId ?? '') + index
