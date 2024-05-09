import { container, inject } from '@undb/di'
import { TableBuilder, TableCreator } from './table.builder'

const TABLE_CREATOR = Symbol.for('TableCreator')
export const injectTableCreator = () => inject(TABLE_CREATOR)
container.register(TABLE_CREATOR, { useClass: TableCreator })

const TABLE_BUILDER = Symbol.for('TableBuilder')
export const injectTableBuilder = () => inject(TABLE_BUILDER)
container.register(TABLE_BUILDER, { useClass: TableBuilder })
