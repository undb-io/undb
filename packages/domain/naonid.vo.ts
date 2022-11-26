import { customAlphabet } from 'nanoid'
import { ID } from './id.vo'

export abstract class NanoID extends ID {
  private static ALPHABETS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  constructor(prefix = '', size = 5) {
    const id = customAlphabet(NanoID.ALPHABETS, size)()
    super(prefix + id)
  }

  public get value(): string {
    return this.props.value
  }
}
