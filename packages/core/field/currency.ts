import { ValueObject } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { z } from 'zod'

const currencySymbol = z.enum(['$', '¥'])
export type ICurrencySymbol = z.infer<typeof currencySymbol>

const defaultSymbol: ICurrencySymbol = '$'

const currency = z.object({
  symbol: currencySymbol,
})

export const createCurrencySchema = z.object({
  symbol: currencySymbol,
})
type ICreateCurrencySchema = z.infer<typeof createCurrencySchema>

type ICurrency = z.infer<typeof currency>

export class Currency extends ValueObject<ICurrency> {
  static default(): Currency {
    return new this({ symbol: defaultSymbol })
  }

  static mustCreate(input?: ICreateCurrencySchema): Currency {
    if (!input) return this.default()
    return new this(input)
  }

  static fromNullable(input?: z.infer<typeof createCurrencySchema>): Option<Currency> {
    if (!input) return None
    return Some(new this(input))
  }
}
