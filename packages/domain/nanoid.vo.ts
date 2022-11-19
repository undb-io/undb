import { customAlphabet } from 'nanoid'
import { ID } from './id.vo'

const DEFAULT_ID_SIZE = 12
const ALPHABETS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export class NanoID extends ID {
  /**
   * generate nano id with prefix
   *
   * @param prefix
   * @param size
   * @returns NanoID
   */
  static generate(prefix = '', size = DEFAULT_ID_SIZE): NanoID {
    // TODO: curry
    const nanoid = customAlphabet(ALPHABETS, size)
    return new NanoID(prefix + nanoid())
  }
}
