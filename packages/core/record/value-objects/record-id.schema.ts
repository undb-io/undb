import * as z from 'zod'
import { RecordId } from './record-id.vo.js'

export const recordIdSchema = z.string().min(1).startsWith(RecordId.RECORD_ID_PREFIX)
