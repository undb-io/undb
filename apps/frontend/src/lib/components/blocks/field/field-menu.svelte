<script lang="ts">
  import { FieldIdVo, getIsFieldCanBeRollup, type Field, type ReferenceField } from "@undb/table"
  import { Button } from "$lib/components/ui/button"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { PencilIcon, TrashIcon } from "lucide-svelte"
  import * as Popover from "$lib/components/ui/popover"
  import UpdateField from "../update-field/update-field.svelte"
  import { cn } from "$lib/utils"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query"
  import { getTable } from "$lib/store/table.store"
  import { toast } from "svelte-sonner"
  import { invalidate } from "$app/navigation"
  import Label from "$lib/components/ui/label/label.svelte"
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import { GetRollupForeignTablesStore } from "$houdini"
  import * as Alert from "$lib/components/ui/alert"
  import { preferences } from "$lib/store/persisted.store"
  import { hasPermission } from "$lib/store/space-member.store"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  export let field: Field
  const table = getTable()

  const dataService = getDataService()

  export let update = false
  export let open = false

  const client = useQueryClient()

  const getForeignTable = createQuery({
    queryFn: () => dataService.table.getTable({ tableId: $table.id.value }),
    queryKey: ["getForeignTable", $table.baseId],
    enabled: field.type === "reference",
  })

  let deleteAlertOpen = false
  $: deleteAlertOpen && field.type === "reference" && $getForeignTable.refetch()

  $: foreignTable = $getForeignTable.data

  $: symmetricField = foreignTable?.schema?.find(
    (f) => f.type === "reference" && f.id === (field as ReferenceField).symmetricFieldId,
  )

  const getRollupForeignTablesStore = new GetRollupForeignTablesStore()

  $: deleteAlertOpen &&
    getIsFieldCanBeRollup(field.type) &&
    getRollupForeignTablesStore.fetch({
      variables: { tableId: $table.id.value, fieldId: field.id.value },
    })

  const deleteField = createMutation({
    mutationFn: dataService.table.field.deleteField,
    async onSuccess() {
      toast.success($LL.table.field.deleted())
      await invalidate(`undb:table:${$table.id.value}`)
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
      open = false
      deleteAlertOpen = false
    },
    onError(error, variables, context) {
      toast.error($LL.table.field.deleteFailed())
    },
  })

  const duplicateField = createMutation({
    mutationFn: dataService.table.field.duplicateField,
    async onSuccess() {
      toast.success("Duplicate field success")
      await invalidate(`undb:table:${$table.id.value}`)
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
      open = false
    },
    onError(error, variables, context) {
      toast.error("Duplicate field failed")
    },
  })
</script>

{#key field}
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
        {#if field.type === "rollup" && field.referenceFieldId}
          {@const referenceField = $table.schema.getFieldById(new FieldIdVo(field.referenceFieldId)).into(undefined)}
          {#if referenceField}
            <div class="space-y-0.5 border-b px-4 py-2 text-xs">
              <div class="text-muted-foreground">Reference field</div>
              <div class="flex items-center gap-2">
                <FieldIcon type="reference" class="text-muted-foreground h-3 w-3" />
                {referenceField.name.value}
              </div>
            </div>
          {/if}
        {/if}

        {#if $hasPermission("field:update")}
          <Button
            class="w-full justify-start rounded-none border-none text-xs focus-visible:ring-0"
            variant="outline"
            on:click={() => (update = true)}
          >
            <PencilIcon class="mr-2 h-3 w-3" />
            {$LL.table.field.update()}
          </Button>
        {/if}

        {#if !field.isSystem}
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild let:builder>
              {#if $hasPermission("field:create")}
                <Button
                  builders={[builder]}
                  class="w-full justify-start rounded-none border-none text-xs focus-visible:ring-0"
                  variant="outline"
                >
                  <TrashIcon class="mr-2 h-3 w-3" />
                  {$LL.table.field.duplicate()}
                </Button>
              {/if}
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>{$LL.table.field.duplicate()}</AlertDialog.Title>
                <AlertDialog.Description>{$LL.table.field.duplicateDescription()}</AlertDialog.Description>
              </AlertDialog.Header>

              <div
                class="text-muted-foreground inline-flex items-center gap-2 rounded-sm border bg-gray-50 p-2 text-xs shadow-sm"
              >
                <FieldIcon {field} type={field.type} class="h-4 w-4" />
                {field.name.value}
              </div>

              <Label class="flex items-center gap-2">
                <Checkbox bind:checked={$preferences.duplicateFieldIncludeData} />
                {$LL.table.record.includeData()}
              </Label>

              <AlertDialog.Footer>
                <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
                <AlertDialog.Action
                  on:click={() => {
                    $duplicateField.mutate({
                      tableId: $table.id.value,
                      id: field.id.value,
                      includeData: $preferences.duplicateFieldIncludeData,
                    })
                  }}
                >
                  {$LL.table.field.duplicate()}
                </AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
          <AlertDialog.Root bind:open={deleteAlertOpen}>
            <AlertDialog.Trigger asChild let:builder>
              {#if $hasPermission("field:delete")}
                <Button
                  builders={[builder]}
                  class="w-full justify-start rounded-none border-none text-xs text-red-500 hover:bg-red-50 hover:text-red-500 focus-visible:ring-0"
                  variant="outline"
                >
                  <TrashIcon class="mr-2 h-3 w-3" />
                  {$LL.table.field.delete()}
                </Button>
              {/if}
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title class="flex items-center">
                  <TrashIcon class="mr-2 h-4 w-4" />
                  <div class="flex items-center gap-2">
                    {$LL.table.field.delete()}

                    <span
                      data-field-id={field.id.value}
                      class="text-muted-foreground inline-flex items-center gap-1 rounded-sm border bg-gray-50 px-2.5 py-1 text-xs shadow-sm"
                    >
                      <FieldIcon {field} type={field.type} class="h-3 w-3" />
                      {field.name.value}
                    </span>
                  </div>
                </AlertDialog.Title>
                <AlertDialog.Description>
                  {$LL.table.field.deleteConfirm()}
                </AlertDialog.Description>
              </AlertDialog.Header>

              <div
                class="text-muted-foreground inline-flex items-center gap-2 rounded-sm border bg-gray-50 p-2 text-xs shadow-sm"
              >
                <FieldIcon {field} type={field.type} class="h-4 w-4" />
                {field.name.value}
              </div>

              {#if field.type === "reference"}
                {@const rollupFields = field.getRollupFields($table.schema.fields)}
                {#if rollupFields.length}
                  <Alert.Root class="border-yellow-500 bg-yellow-50">
                    <Alert.Title>Deleting rollup fields</Alert.Title>
                    <Alert.Description>
                      The following rollup field
                      {#each rollupFields as field}
                        <span
                          class="text-muted-foreground inline-flex items-center gap-1 rounded-sm border bg-gray-50 p-1 text-xs shadow-sm"
                        >
                          <FieldIcon {field} type={field.type} class="h-3 w-3" />
                          {field.name.value}
                        </span>
                      {/each}

                      will also be deleted.
                    </Alert.Description>
                  </Alert.Root>
                {/if}
                {#if symmetricField}
                  {@const foreignRollupFields =
                    foreignTable?.schema.filter(
                      (f) => f.type === "rollup" && f.option?.referenceFieldId === symmetricField.id,
                    ) ?? []}
                  <Alert.Root class="border-yellow-500 bg-yellow-50">
                    <Alert.Title>Deleting symmetric fields</Alert.Title>
                    <Alert.Description>
                      The following symmetric field
                      <span
                        class="text-muted-foreground inline-flex items-center gap-1 rounded-sm border bg-gray-50 p-1 text-xs shadow-sm"
                      >
                        <FieldIcon type={symmetricField.type} class="h-3 w-3" />
                        {symmetricField.name}
                      </span>
                      {#each foreignRollupFields as field}
                        <span
                          class="text-muted-foreground inline-flex items-center gap-1 rounded-sm border bg-gray-50 p-1 text-xs shadow-sm"
                        >
                          <FieldIcon type={field.type} class="h-3 w-3" />
                          {field.name}
                        </span>
                      {/each}

                      of
                      <span class="font-bold">
                        {foreignTable?.name}
                      </span>
                      will also be deleted.
                    </Alert.Description>
                  </Alert.Root>
                {/if}
              {/if}

              {#if getIsFieldCanBeRollup(field.type)}
                {@const foreignRollupFields =
                  $getRollupForeignTablesStore.data?.rollupForeignTables.flatMap(
                    (table) =>
                      table?.schema.filter((f) => f.type === "rollup" && f.option?.rollupFieldId === field.id.value) ??
                      [],
                  ) ?? []}
                <Alert.Root class="border-yellow-500 bg-yellow-50">
                  <Alert.Title>Deleting foreign table rollup fields</Alert.Title>
                  <Alert.Description>
                    The following rollup fields
                    {#each foreignRollupFields as field}
                      <span
                        class="text-muted-foreground inline-flex items-center gap-1 rounded-sm border bg-gray-50 p-1 text-xs shadow-sm"
                      >
                        <FieldIcon type={field.type} class="h-3 w-3" />
                        {field.name}
                      </span>
                    {/each}
                    will also be deleted.
                  </Alert.Description>
                </Alert.Root>
              {/if}

              <AlertDialog.Footer>
                <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
                <AlertDialog.Action
                  class="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                  on:click={() => {
                    $deleteField.mutate({
                      tableId: $table.id.value,
                      id: field.id.value,
                    })
                  }}
                >
                  <TrashIcon class="mr-2 h-4 w-4" />
                  {$LL.table.field.delete()}
                </AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
        {/if}
      </div>
    {/if}
  </Popover.Content>
{/key}
