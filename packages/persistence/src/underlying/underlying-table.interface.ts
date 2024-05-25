import type { ColumnDataType, ColumnDefinitionBuilderCallback, Expression } from "kysely"

export interface ColumnAlteringExcutableInterface extends ColumnAlteringInterface {
  execute(): Promise<void>
}

export interface ColumnAlteringInterface {
  addColumn(
    columnName: string,
    dataType: ColumnDataType | Expression<any>,
    build?: ColumnDefinitionBuilderCallback,
  ): ColumnAlteringInterface
  execute?(): Promise<void>
}
