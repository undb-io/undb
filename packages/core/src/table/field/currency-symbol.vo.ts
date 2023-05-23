import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const currencySymbol = z.enum(['$', '¥'])

export type ICurrencySymbol = z.infer<typeof currencySymbol>

export const currencySymbols: ICurrencySymbol[] = ['$', '¥']

export class CurrencySymbol extends ValueObject<ICurrencySymbol> {
  public get symbol() {
    return this.props.value
  }
}
