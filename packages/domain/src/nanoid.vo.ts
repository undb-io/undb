import { customAlphabet } from 'nanoid'
import { ID } from './id.vo.js'

export abstract class NanoID extends ID {
  private static ALPHABETS = '0123456789abcdefghijklmnopqrstuvwxyz'

  static createId(prefix = '', size = 5) {
    const id = customAlphabet(NanoID.ALPHABETS, size)()
    return prefix + id
  }

  public get value(): string {
    return this.props.value
  }
}
