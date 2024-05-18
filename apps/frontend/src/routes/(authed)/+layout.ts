import { GetTablesQueryStore } from "$houdini"
import { createTableCommand } from "@undb/commands"
import { createSchemaDTO } from "@undb/table"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { z } from "zod"
import type { LayoutLoad } from "./$types"

export const ssr = false

export const load: LayoutLoad = async (event) => {
  event.depends("undb:tables")

  const tables = await new GetTablesQueryStore().fetch({ event })

  const createTableForm = await superValidate(
    zod(
      // @ts-ignore
      createTableCommand.merge(
        z.object({
          schema: createSchemaDTO.default([{ type: "string", name: "field1" }]),
        }),
      ),
    ),
  )

  return {
    tables,
    createTableForm,
  }
}
