<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { getTable } from "$lib/store/table.store"
  import { cn } from "$lib/utils"
  import { FieldIdVo } from "@undb/table"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js"
  import FieldControl from "../field-control/field-control.svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { pick } from "radash"
  import { toast } from "svelte-sonner"
  import * as Form from "$lib/components/ui/form"
  import * as Alert from "$lib/components/ui/alert/index.js"
  import { PencilIcon } from "lucide-svelte"

  const table = getTable()
  const mutableFields = $table.schema.mutableFields
  const schema = $table.schema.getMutableSchema()

  let selectedFieldIds: string[] = mutableFields.length ? [mutableFields[0].id.value] : []
  $: selectedFields = selectedFieldIds.map((id) => $table.schema.getFieldById(new FieldIdVo(id)).unwrap())

  const client = useQueryClient()

  const updateRecordMutation = createMutation({
    mutationFn: trpc.record.bulkUpdate.mutate,
    onSuccess: async () => {
      toast.success("Record updated")
      reset({})
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const updateRecord = (values: any) => {
    // if (readonly) return
    // const recordId = record.id.value
    // $updateRecordMutation.mutate({
    //   tableId: $table.id.value,
    //   id: recordId,
    //   values,
    // })
  }

  const form = superForm(defaults({}, zodClient(schema)), {
    SPA: true,
    dataType: "json",
    validators: zodClient(schema),
    resetForm: false,
    invalidateAll: false,
    onUpdate(event) {
      if (!event.form.valid) {
        return
      }

      const data = event.form.data
      const values = $tainted ? pick(data, Object.keys($tainted)) : undefined
      if (values) {
        updateRecord(values)
      }
    },
  })

  const { form: formData, enhance, allErrors, tainted, reset, errors } = form
</script>

<div class="grid h-full grid-cols-4">
  <div class="col-span-3 border-r px-4 py-3">
    <form
      method="POST"
      use:enhance
      id={`${$table.id.value}:updateRecord`}
      class="my-4 space-y-8"
      enctype="multipart/form-data"
    >
      {#if !selectedFields.length}
        <Alert.Root>
          <PencilIcon class="h-4 w-4" />
          <Alert.Title>Add Update Field</Alert.Title>
          <Alert.Description>SELECT COLUMNS TO EDIT</Alert.Description>
        </Alert.Root>
      {/if}
      {#each selectedFields as field}
        {@const dirty = $tainted && $tainted[field.id.value]}
        <Form.Field class="flex gap-4 space-y-0" {form} name={field.id.value}>
          <Form.Control let:attrs>
            <Form.Label class="text-muted-foreground flex h-4 w-48 items-center justify-between gap-2 pt-2">
              <div class="flex items-center gap-2">
                <FieldIcon {field} type={field.type} class="h-4 w-4" />
                <span class="flex-1 truncate">{field.name.value}</span>
                {#if field.required}
                  <span class="text-red-500">*</span>
                {/if}
                {#if dirty}
                  <span
                    class="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    updated
                  </span>
                {/if}
              </div>
            </Form.Label>
            <div class="flex-1">
              <FieldControl
                {...attrs}
                bind:value={$formData[field.id.value]}
                {field}
                tableId={$table.id.value}
                class={cn($errors[field.id.value] && "border-red-500 focus-visible:ring-0")}
              />
              <Form.FieldErrors class="mt-2" />
            </div>
          </Form.Control>
        </Form.Field>
      {/each}
    </form>
  </div>

  <div class="col-span-1 h-full px-3 py-3">
    <ScrollArea class="h-full">
      <p class="text-muted-foreground mb-2 font-normal">SELECT COLUMNS TO EDIT</p>
      <div class="mb-2 flex w-full items-center gap-2">
        <Button
          class="flex-1"
          size="sm"
          variant="outline"
          on:click={() => (selectedFieldIds = mutableFields.map((f) => f.id.value))}>Select All</Button
        >
        <Button size="sm" class="flex-1" variant="outline" on:click={() => (selectedFieldIds = [])}>Remove All</Button>
      </div>
      <div class="space-y-2">
        {#each mutableFields as field}
          {@const selected = selectedFieldIds.includes(field.id.value)}
          <Button
            variant={selected ? "default" : "outline"}
            class={cn("w-full shadow-sm")}
            on:click={() => {
              selectedFieldIds.includes(field.id.value)
                ? (selectedFieldIds = selectedFieldIds.filter((f) => f !== field.id.value))
                : (selectedFieldIds = [...selectedFieldIds, field.id.value])
            }}
          >
            <FieldIcon class="mr-2 h-4 w-4" {field} type={field.type} />
            {field.name.value}
          </Button>
        {/each}
      </div>
    </ScrollArea>
  </div>
</div>
