import type { ZodSchema } from "@undb/zod"
import { customAlphabet } from "nanoid"
import { ValueObject } from "./value-object.js"

const ALPHABETS = "0123456789abcdefghijklmnopqrstuvwxyz"

export const IdFactory = (prefix: string, size = 10, schema?: ZodSchema) => {
  return class extends ID {
    constructor(id: string) {
      super(id)
    }

    static create(id = customAlphabet(ALPHABETS, size)()) {
      const value = `${prefix}${id}`
      return new this(value)
    }

    static fromStringOrCreate(id?: string) {
      if (!id) {
        return this.create()
      }

      return new this(id)
    }
  }
}

export abstract class ID extends ValueObject<string> {
  constructor(value: string) {
    super({ value })
  }

  public get value(): string {
    return this.props.value
  }
}
