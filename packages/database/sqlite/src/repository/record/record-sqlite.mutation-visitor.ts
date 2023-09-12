/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type {
  BoolIsFalse,
  BoolIsTrue,
  CollaboratorEqual,
  CollaboratorIsEmpty,
  CreatedByIn,
  DateBetween,
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateIsTomorrow,
  DateIsYesterday,
  DateLessThan,
  DateLessThanOrEqual,
  DateRangeDateEqual,
  DateRangeDateGreaterThan,
  DateRangeDateGreaterThanOrEqual,
  DateRangeDateLessThan,
  DateRangeDateLessThanOrEqual,
  DateRangeEmpty,
  DateRangeEqual,
  HasExtension,
  HasFileType,
  IClsService,
  IRecordVisitor,
  IsAttachmentEmpty,
  IsTreeRoot,
  JsonEmpty,
  MultiSelectEqual,
  MultiSelectIn,
  MultiSelectIsEmpty,
  NumberEmpty,
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  ParentAvailableSpec,
  ReferenceEqual,
  SelectEmpty,
  SelectEqual,
  SelectIn,
  StringContain,
  StringEndsWith,
  StringEqual,
  StringRegex,
  StringStartsWith,
  TableSchemaIdMap,
  TreeAvailableSpec,
  UdpatedByIn,
  WithRecordAutoIncrement,
  WithRecordCreatedAt,
  WithRecordCreatedBy,
  WithRecordId,
  WithRecordIds,
  WithRecordLike,
  WithRecordTableId,
  WithRecordUpdatedAt,
  WithRecordUpdatedBy,
  WithRecordValues,
} from '@undb/core'
import { isEmpty } from 'lodash-es'
import { BaseEntityManager } from '../base-entity-manager.js'
import { RecordValueSqliteMutationVisitor } from './record-value-sqlite.mutation-visitor.js'

export class RecordSqliteMutationVisitor extends BaseEntityManager implements IRecordVisitor {
  constructor(
    private readonly cls: IClsService,
    private readonly tableId: string,
    private readonly recordId: string,
    private readonly schema: TableSchemaIdMap,
    em: EntityManager,
    private readonly qb: Knex.QueryBuilder,
  ) {
    super(em)
  }

  public readonly updatedFieldIds = new Set<string>()

  dateRangeDateEqual(s: DateRangeDateEqual): void {
    throw new Error('Method not implemented.')
  }
  dateRangeDateGreaterThan(s: DateRangeDateGreaterThan): void {
    throw new Error('Method not implemented.')
  }
  dateRangeDateLessThan(s: DateRangeDateLessThan): void {
    throw new Error('Method not implemented.')
  }
  dateRangeDateGreaterThanOrEqual(s: DateRangeDateGreaterThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  dateRangeDateLessThanOrEqual(s: DateRangeDateLessThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  like(s: WithRecordLike): void {
    throw new Error('Method not implemented.')
  }
  multiSelectEqual(s: MultiSelectEqual): void {
    throw new Error('Method not implemented.')
  }
  multiSelectIn(s: MultiSelectIn): void {
    throw new Error('Method not implemented.')
  }
  multiSelectIsEmpty(s: MultiSelectIsEmpty): void {
    throw new Error('Method not implemented.')
  }
  collaboratorEqual(s: CollaboratorEqual): void {
    throw new Error('Method not implemented.')
  }
  collaboratorIsEmpqy(s: CollaboratorIsEmpty): void {
    throw new Error('Method not implemented.')
  }
  updatedByIn(s: UdpatedByIn): void {
    throw new Error('Method not implemented.')
  }
  createdByIn(s: CreatedByIn): void {
    throw new Error('Method not implemented.')
  }
  private createRecordValueVisitor(fieldId: string) {
    return new RecordValueSqliteMutationVisitor(
      this.cls,
      this.tableId,
      fieldId,
      this.recordId,
      false,
      this.schema,
      this.em,
    )
  }

  idEqual(s: WithRecordId): void {
    throw new Error('Method not implemented.')
  }
  idsIn(s: WithRecordIds): void {
    throw new Error('Method not implemented.')
  }

  tableIdEqual(s: WithRecordTableId): void {
    throw new Error('Method not implemented.')
  }
  autoIncrement(s: WithRecordAutoIncrement): void {
    throw new Error('Method not implemented.')
  }
  createdAt(s: WithRecordCreatedAt): void {
    throw new Error('Method not implemented.')
  }
  createdBy(s: WithRecordCreatedBy): void {
    throw new Error('Method not implemented.')
  }
  updatedAt(s: WithRecordUpdatedAt): void {
    throw new Error('Method not implemented.')
  }
  updatedBy(s: WithRecordUpdatedBy): void {
    throw new Error('Method not implemented.')
  }
  values(s: WithRecordValues): void {
    for (const [fieldId, value] of s.values) {
      const field = this.schema.get(fieldId)
      if (!field) continue

      if (!field.controlled && !field.system) {
        this.updatedFieldIds.add(fieldId)
      }

      const valueVisitor = this.createRecordValueVisitor(fieldId)

      value.accept(valueVisitor)

      this.addJobs(...valueVisitor.jobs)
      if (!isEmpty(valueVisitor.data)) {
        const update = this.qb.update(valueVisitor.data).toQuery()
        this.addQueries(update)
      }
      this.addQueries(...valueVisitor.queries)
    }
  }
  stringEqual(s: StringEqual): void {
    throw new Error('Method not implemented.')
  }
  stringContain(s: StringContain): void {
    throw new Error('Method not implemented.')
  }
  stringStartsWith(s: StringStartsWith): void {
    throw new Error('Method not implemented.')
  }
  stringEndsWith(s: StringEndsWith): void {
    throw new Error('Method not implemented.')
  }
  stringRegex(s: StringRegex): void {
    throw new Error('Method not implemented.')
  }
  stringEmpty(s: StringEqual): void {
    throw new Error('Method not implemented.')
  }
  jsonEmpty(s: JsonEmpty): void {
    throw new Error('Method not implemented.')
  }
  numberEqual(s: NumberEqual): void {
    throw new Error('Method not implemented.')
  }
  numberGreaterThan(s: NumberGreaterThan): void {
    throw new Error('Method not implemented.')
  }
  numberLessThan(s: NumberLessThan): void {
    throw new Error('Method not implemented.')
  }
  numberGreaterThanOrEqual(s: NumberGreaterThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  numberLessThanOrEqual(s: NumberLessThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  numberEmpty(s: NumberEmpty): void {
    throw new Error('Method not implemented.')
  }
  dateEqual(s: DateEqual): void {
    throw new Error('Method not implemented.')
  }
  dateGreaterThan(s: DateGreaterThan): void {
    throw new Error('Method not implemented.')
  }
  dateLessThan(s: DateLessThan): void {
    throw new Error('Method not implemented.')
  }
  dateGreaterThanOrEqual(s: DateGreaterThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  dateLessThanOrEqual(s: DateLessThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  dateIsToday(s: DateIsToday): void {
    throw new Error('Method not implemented.')
  }
  dateIsTomorrow(s: DateIsTomorrow): void {
    throw new Error('Method not implemented.')
  }
  dateIsYesterday(s: DateIsYesterday): void {
    throw new Error('Method not implemented.')
  }
  dateRangeEqual(s: DateRangeEqual): void {
    throw new Error('Method not implemented.')
  }
  dateRangeEmpty(s: DateRangeEmpty): void {
    throw new Error('Method not implemented.')
  }
  dateBetween(s: DateBetween): void {
    throw new Error('Method not implemented.')
  }
  selectEqual(s: SelectEqual): void {
    throw new Error('Method not implemented.')
  }
  selectIn(s: SelectIn): void {
    throw new Error('Method not implemented.')
  }
  selectEmpty(s: SelectEmpty): void {
    throw new Error('Method not implemented.')
  }
  boolIsTrue(s: BoolIsTrue): void {
    throw new Error('Method not implemented.')
  }
  boolIsFalse(s: BoolIsFalse): void {
    throw new Error('Method not implemented.')
  }
  referenceEqual(s: ReferenceEqual): void {
    throw new Error('Method not implemented')
  }
  treeAvailable(s: TreeAvailableSpec): void {
    throw new Error('Method not implemented.')
  }
  isTreeRoot(s: IsTreeRoot): void {
    throw new Error('Method not implemented.')
  }
  parentAvailable(s: ParentAvailableSpec): void {
    throw new Error('Method not implemented.')
  }
  hasFileType(s: HasFileType): void {
    throw new Error('Method not implemented.')
  }
  hasExtension(s: HasExtension): void {
    throw new Error('Method not implemented.')
  }
  isAttachmentEmpty(s: IsAttachmentEmpty): void {
    throw new Error('Method not implemented.')
  }

  or(): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
