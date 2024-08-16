<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation"
  import Button from "$lib/components/ui/button/button.svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import { closeModal, DUPLICATE_TABLE_MODAL, isModalOpen } from "$lib/store/modal.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { duplicateTableCommand } from "@undb/commands"
  import type { TableDo } from "@undb/table"
  import { LoaderCircleIcon, SirenIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import * as Alert from "$lib/components/ui/alert"
  import { getTable } from "$lib/store/table.store"

  const table = getTable()

  const form = superForm(
    defaults(
      {
        tableId: $table.id.value,
        name: "",
        includeData: true,
      },
      zodClient(duplicateTableCommand),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(duplicateTableCommand),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) {
          return
        }

        $duplicateTableMutation.mutate(event.form.data)
      },
    },
  )

  const { form: formData, enhance } = form

  const duplicateTableMutation = createMutation({
    mutationFn: trpc.table.duplicate.mutate,
    onSuccess: async (data) => {
      await invalidateAll()
      closeModal(DUPLICATE_TABLE_MODAL)
      await goto(`/t/${data}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
</script>

<Dialog.Root
  open={$isModalOpen(DUPLICATE_TABLE_MODAL)}
  onOpenChange={(open) => {
    if (!open) {
      closeModal(DUPLICATE_TABLE_MODAL)
    }
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Duplicate Table {$table.name.value}</Dialog.Title>
      <Dialog.Description>
        Create a new table with the same structure as {$table.name.value}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance class="space-y-4">
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.Description>This is new table display name.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="includeData" class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <Form.Control let:attrs>
          <Checkbox {...attrs} bind:checked={$formData.includeData} />
          <div class="space-y-1 leading-none">
            <Form.Label>Include data</Form.Label>
            <Form.Description>Include data in the new table.</Form.Description>
          </div>
          <input name={attrs.name} value={$formData.includeData} hidden />
        </Form.Control>
      </Form.Field>

      <Alert.Root>
        <Alert.Description class="flex items-center text-xs">
          <SirenIcon class="mr-2 h-4 w-4" />
          System fields will be updated to the current user and timestamp.
        </Alert.Description>
      </Alert.Root>

      <div class="item-center flex justify-end gap-2">
        <Button
          on:click={() => {
            closeModal(DUPLICATE_TABLE_MODAL)
          }}
          variant="outline"
        >
          Cancel
        </Button>
        <Form.Button disabled={$duplicateTableMutation.isPending}>
          {#if $duplicateTableMutation.isPending}
            <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
          {/if}
          Duplicate
        </Form.Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
