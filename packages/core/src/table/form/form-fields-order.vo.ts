import { OrderVO } from '@undb/domain'

export class FormFieldsOrder extends OrderVO {
  public getPreviousFieldIds(fieldId: string) {
    if (!this.order.includes(fieldId)) return []
    const result: string[] = []

    for (const value of this.order) {
      if (value === fieldId) break
      result.push(value)
    }

    return result
  }

  public isFirst(fieldId: string): boolean {
    return this.order[0] === fieldId
  }
}
