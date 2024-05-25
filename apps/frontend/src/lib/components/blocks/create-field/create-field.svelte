<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { createFieldDTO } from "@undb/table"
  import { derived } from "svelte/store"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"

  const table = getTable()

  const createFieldMutation = createMutation(
    derived([table], ([$table]) => ({
      mutationKey: ["createField", $table.id.value],
      mutationFn: trpc.field.create.mutate,
    })),
  )

  const form = superForm(
    defaults(
      {
        type: "string",
        name: "",
        constraint: {},
      },
      zodClient(createFieldDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(createFieldDTO),
      resetForm: false,
      invalidateAll: true,
      onUpdate(event) {
        if (!event.form.valid) return

        $createFieldMutation.mutate({
          tableId: $table.id.value,
          field: event.form.data,
        })
      },
    },
  )
</script>
