<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { FormVO } from "@undb/table"
  import { FormFieldsVO } from "@undb/table"
  import FieldControl from "../field-control/field-control.svelte"
  import FormFieldOptions from "./form-field-options.svelte"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { cn } from "$lib/utils"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { tick } from "svelte"
  import { queryParam } from "sveltekit-search-params"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import autoAnimate from "@formkit/auto-animate"
  import Button from "$lib/components/ui/button/button.svelte"
  import { PlusIcon, GripVerticalIcon } from "lucide-svelte"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import { isNumber } from "radash"
  import { getFormBgColor } from "./form-bg-color"
  import { invalidate } from "$app/navigation"
  import { derived } from "svelte/store"
  import { LL } from "@undb/i18n/client"

  export let readonly = false

  const selectedFieldId = queryParam("formField")

  const table = getTable()

  export let form: FormVO

  $: formFields = form.visibleFields

  const setFormMutation = createMutation({
    mutationKey: ["table", $table.id.value, "setForm"],
    mutationFn: trpc.table.form.set.mutate,
    async onSuccess() {
      await invalidate(`undb:table:${$table.id.value}`)
    },
  })

  const setForm = async () => {
    await tick()
    $setFormMutation.mutate({
      tableId: $table.id.value,
      form: form.toJSON(),
    })
  }

  let isEditingFormName = false

  let el: HTMLDivElement | undefined
  $: if ($selectedFieldId) {
    el?.querySelector(`[data-field-id="${$selectedFieldId}"]`)?.scrollIntoView({ behavior: "smooth" })
  }

  let isAddingDescription = false
  const addDescription = () => {
    isAddingDescription = true
  }

  const swap = async (oldIndex: number, newIndex: number) => {
    const newFormFields = [...form.fields.props]
    const [removed] = newFormFields.splice(oldIndex, 1)
    newFormFields.splice(newIndex, 0, removed)
    form.fields = new FormFieldsVO(newFormFields)
    await tick()
    await setForm()
  }

  $: backgroundColor = form.option?.backgroundColor
</script>

<div
  class={cn(
    "h-full w-full space-y-2 overflow-y-auto bg-gray-50 shadow-inner transition-colors",
    backgroundColor && getFormBgColor(backgroundColor),
  )}
  data-form-id={form.id}
>
  <div class="bg-background mx-auto mb-6 mt-12 max-w-[800px] rounded-2xl px-10 py-6 shadow-2xl">
    {#if isEditingFormName}
      <input
        class="block w-full text-4xl font-extrabold tracking-tight"
        bind:value={form.name}
        {readonly}
        on:change={() => {
          setForm()
          isEditingFormName = false
        }}
      />
    {:else}
      <h2
        class="text-4xl font-extrabold tracking-tight"
        on:click={() => {
          if (!readonly) {
            isEditingFormName = true
          }
        }}
      >
        {form.name}
      </h2>
    {/if}

    {#if form.description || isAddingDescription}
      <div class="my-2">
        <Label>{$LL.common.description()}</Label>
        <Input {readonly} class="text-sm" bind:value={form.description} on:change={setForm}></Input>
      </div>
    {:else if !readonly}
      <Button variant="link" size="sm" class="-mx-4" on:click={addDescription}>
        <PlusIcon class="mr-2 h-4 w-4" />
        {$LL.table.form.addDescription()}
      </Button>
    {/if}

    <div class="space-y-2" bind:this={el} use:autoAnimate>
      <SortableList
        class="space-y-2 pb-2"
        handle=".handler"
        disabled={readonly}
        animation={200}
        onEnd={(event) => {
          if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
            swap(event.oldIndex, event.newIndex)
          }
        }}
      >
        {#each formFields as _, i (formFields[i].fieldId)}
          {@const formField = formFields[i]}
          {@const field = $table.schema.getFieldByIdOrName(formField.fieldId).into(undefined)}
          {#if field}
            {@const required = formField.getRequired(field)}
            {@const isSelected = $selectedFieldId === field.id.value}
            <label class={cn("block")} data-field-id={formField.fieldId}>
              <input
                disabled={readonly}
                type="radio"
                class="hidden"
                bind:group={$selectedFieldId}
                value={field.id.value}
              />
              <Collapsible.Root
                open={isSelected}
                onOpenChange={(open) => {
                  if (!open) {
                    $selectedFieldId = null
                  }
                }}
                class={cn(
                  "bg-background relative -mx-4 space-y-2 rounded-md border-2 border-transparent p-0 px-4 transition-all",
                  isSelected ? "border-primary shadow-lg" : !readonly && "hover:bg-muted/50",
                )}
              >
                {#if isSelected}
                  <button
                    disabled={readonly}
                    type="button"
                    class="handler bg-primary absolute -left-2 top-2 rounded-sm py-2"
                  >
                    <GripVerticalIcon class="h-4 w-4 text-white" />
                  </button>
                {/if}
                <div class={cn("cursor-pointer space-y-2 py-2 pb-4", readonly && "pointer-events-none")}>
                  <div class="text-md flex items-center gap-2 font-medium">
                    <FieldIcon {field} type={field.type} class="h-4 w-4" />
                    <span>
                      {field.name.value}
                    </span>
                    {#if required}
                      <span class="text-red-500">*</span>
                    {/if}
                    {#if formField.conditionEnabled && formField.hasCondition}
                      <span
                        class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                      >
                        {$LL.table.form.condition()}
                      </span>
                    {/if}
                    {#if form.getIsFormFieldContionInValid(formField.fieldId)}
                      <span
                        class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
                      >
                        {$LL.table.form.invalidCondition()}
                      </span>
                    {/if}
                  </div>
                  <FieldControl
                    {field}
                    readonly={readonly || field.type === "attachment"}
                    tableId={$table.id.value}
                    value={formField.defaultValue}
                    onValueChange={(value) => {
                      formField.defaultValue = value
                      setForm()
                    }}
                    class="bg-background"
                    placeholder={$LL.table.form.setDefaultValue({field: field.name.value})}
                  />
                </div>
                <Collapsible.Content>
                  <FormFieldOptions {field} bind:formField={formFields[i]} bind:form class="-mx-4" />
                </Collapsible.Content>
              </Collapsible.Root>
            </label>
          {/if}
        {/each}
      </SortableList>

      <div class="flex justify-between">
        <div></div>
        <Button>{$LL.common.submit()}</Button>
      </div>
    </div>
  </div>
</div>
