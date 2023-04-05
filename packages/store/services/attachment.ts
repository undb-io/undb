import type { IAttachmentItem } from '@egodb/core'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const attachment = createApi({
  reducerPath: 'attachment',
  baseQuery: fetchBaseQuery(),
  endpoints: (builder) => ({
    upload: builder.mutation<IAttachmentItem, FormData>({
      query: (data) => ({
        url: 'attachment/upload',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const { useUploadMutation } = attachment
