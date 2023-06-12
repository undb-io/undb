export interface IBaseRecordEventPayload {
  tableId: string
  tableName: string
}

export type BaseRecordEventName = `record.${string}`
