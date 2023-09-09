import { NanoID } from '@undb/domain'
import { z } from 'zod'

export class TemplateID extends NanoID {
  public static TEMPLATE_ID_PREFIX = 'tpl'
  private static TEMPLATE_ID_SIZE = 8

  static create(): TemplateID {
    const id = NanoID.createId(TemplateID.TEMPLATE_ID_PREFIX, TemplateID.TEMPLATE_ID_SIZE)
    return new TemplateID(id)
  }

  static from(id: string): TemplateID {
    return new TemplateID(id)
  }

  static fromOrCreate(id?: string): TemplateID {
    if (!id) {
      return TemplateID.create()
    }
    return TemplateID.from(id)
  }
}

export const templateIdSchema = z.string().startsWith(TemplateID.TEMPLATE_ID_PREFIX)
