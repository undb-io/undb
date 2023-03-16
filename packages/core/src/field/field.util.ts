import type { IFieldType } from './field.type'

const controlledFieldTypes: IFieldType[] = ['id', 'auto-increment', 'created-at', 'updated-at', 'count']

export const isControlledFieldType = (type: IFieldType): boolean => controlledFieldTypes.includes(type)
