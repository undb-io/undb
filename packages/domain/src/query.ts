export type QueryProps<T> = Omit<T, "correlationId" | "commandId"> & Partial<Query>

export abstract class Query {}
