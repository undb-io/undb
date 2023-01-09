import type { ITableRepository, ITableSpec, Table } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import type { SelectField } from '../../entity'
import { Option as OptionEntity, OptionColor, Table as TableEntity } from '../../entity'
import { FieldFactory } from '../../entity/field.factory'
import { Calendar, Kanban, View as ViewEntity } from '../../entity/view'
import { TableSqliteMapper } from './table-sqlite.mapper'
import { TableSqliteMutationVisitor } from './table-sqlite.mutation-visitor'

export class TableSqliteRepository implements ITableRepository {
  constructor(protected readonly em: EntityManager) {}

  async findOneById(id: string): Promise<Option<Table>> {
    const table = await this.em.findOne(TableEntity, id, { populate: ['fields.options', 'views'] })
    if (!table) return None

    return Some(TableSqliteMapper.entityToDomain(table).unwrap())
  }

  findOne(spec: ITableSpec): Promise<Option<Table>> {
    throw new Error('Method not implemented.')
  }

  find(spec: ITableSpec): Promise<Table[]> {
    throw new Error('Method not implemented.')
  }

  async insert(table: Table): Promise<void> {
    const tableEntity = new TableEntity()
    tableEntity.id = table.id.value
    tableEntity.name = table.name.value

    for (const field of table.schema.fields) {
      const fieldEntity = FieldFactory.create(field)

      fieldEntity.id = field.id.value
      fieldEntity.type = field.type
      fieldEntity.name = field.name.value
      fieldEntity.table = tableEntity

      if (field.type === 'select') {
        for (const option of field.options.options) {
          const optionEntity = new OptionEntity()
          optionEntity.id = option.id.value
          optionEntity.name = option.name.value
          optionEntity.field = fieldEntity as SelectField

          const optionColor = new OptionColor()
          optionColor.name = option.color.name
          optionColor.shade = option.color.shade
          optionEntity.color = optionColor

          this.em.persist(optionEntity)
        }
      }

      this.em.persist(fieldEntity)
    }

    for (const view of table.views.views ?? []) {
      const viewEntity = new ViewEntity()
      viewEntity.id = view.id.value
      viewEntity.name = view.name.value
      viewEntity.table = tableEntity
      viewEntity.displayType = view.displayType
      viewEntity.filter = view.filter?.value

      const kanban = new Kanban()
      kanban.fieldId = view.kanban.into()?.unpack().fieldId?.value
      viewEntity.kanban = kanban

      const calendar = new Calendar()
      calendar.fieldId = view.calendar.into()?.unpack().fieldId?.value
      viewEntity.calendar = calendar

      viewEntity.fieldsOrder = view.fieldsOrder?.unpack()
      viewEntity.fieldOptions = view.fieldOptions?.value ? Object.fromEntries(view.fieldOptions.value) : undefined

      this.em.persist(viewEntity)
    }

    this.em.persist(tableEntity)

    await this.em.flush()
  }

  async updateOneById(id: string, spec: ITableSpec): Promise<void> {
    const visitor = new TableSqliteMutationVisitor(id, this.em)

    spec.accept(visitor)

    await visitor.em.flush()
  }
}
