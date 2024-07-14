<script lang="ts">
  import type { Field } from "@undb/table"
  import { Button } from "$lib/components/ui/button"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { PencilIcon, TrashIcon } from "lucide-svelte"
  import * as Popover from "$lib/components/ui/popover"
  import UpdateField from "../update-field/update-field.svelte"
  import { cn } from "$lib/utils"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import { toast } from "svelte-sonner"
  import { invalidate } from "$app/navigation"

  export let field: Field
  const table = getTable()

  export let update = false
  export let open = false

  const client = useQueryClient()
  const deleteField = createMutation({
    mutationFn: trpc.table.field.delete.mutate,
    async onSuccess() {
      toast.success("Delete field success")
      await invalidate(`table:${$table.id.value}`)
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
    },
  })
</script>

<Popover.Content class={cn("p-0 transition-all", update ? "w-[400px]" : "w-[250px]")}>
  {#if update}
    <UpdateField
      class="px-4 py-6"
      {field}
      onSuccess={() => {
        open = false
        update = false
      }}
    />
  {:else}
    <div class="w-full">
      <Button
        class="w-full justify-start rounded-none border-none text-xs"
        variant="outline"
        on:click={() => (update = true)}
      >
        <PencilIcon class="mr-2 h-3 w-3" />
        Update Field
      </Button>

      {#if !field.isSystem}
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              class="w-full justify-start rounded-none border-none text-xs text-red-500 hover:bg-red-50 hover:text-red-500"
              variant="outline"
            >
              <TrashIcon class="mr-2 h-3 w-3" />
              Delete Field
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Delete field</AlertDialog.Title>
              <AlertDialog.Description>
                Are you sure you want to delete the following field? All data associated with this field will be delete
                perminently from server.
              </AlertDialog.Description>
            </AlertDialog.Header>

            <div
              class="text-muted-foreground inline-flex items-center gap-2 rounded-sm border bg-gray-50 p-2 text-xs shadow-sm"
            >
              <FieldIcon {field} type={field.type} class="h-4 w-4" />
              {field.name.value}
            </div>

            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action
                class="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                on:click={() => {
                  $deleteField.mutate({
                    tableId: $table.id.value,
                    id: field.id.value,
                  })
                }}
              >
                Delete field
              </AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      {/if}
    </div>
  {/if}
</Popover.Content>
