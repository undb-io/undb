export const TABLE_ALIAS = 't'
export const FOREIGN_TABLE_ALIAS_PREFIX = 'ft'

export type ForeignTableAlias = `${typeof FOREIGN_TABLE_ALIAS_PREFIX}${number}`

export const getFTAlias = (index: number): ForeignTableAlias => `${FOREIGN_TABLE_ALIAS_PREFIX}${index}`
