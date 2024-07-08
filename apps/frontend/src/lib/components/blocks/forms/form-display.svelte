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
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte"
  import autoAnimate from "@formkit/auto-animate"
  import Button from "$lib/components/ui/button/button.svelte"
  import { PlusIcon, GripVerticalIcon } from "lucide-svelte"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import { isNumber } from "radash"
  import { getFormBgColor } from "./form-bg-color"
  import { invalidate } from "$app/navigation"

  const selectedFieldId = queryParam("formField")

  const table = getTable()

  $: schema = $table.schema.fieldMapById

  export let form: FormVO

  $: formFields = form.visibleFields

  const setFormMutation = createMutation({
    mutationKey: ["table", $table.id.value, "setForm"],
    mutationFn: trpc.table.form.set.mutate,
    async onSuccess() {
      await invalidate(`table:${$table.id.value}`)
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

  let el: HTMLDivElement
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
        on:change={() => {
          setForm()
          isEditingFormName = false
        }}
      />
    {:else}
      <h2 class="text-4xl font-extrabold tracking-tight" on:click={() => (isEditingFormName = true)}>
        {form.name}
      </h2>
    {/if}

    {#if form.description || isAddingDescription}
      <div class="my-2">
        <Label>Description</Label>
        <Input class="text-sm" bind:value={form.description} on:change={setForm}></Input>
      </div>
    {:else}
      <Button variant="link" size="sm" class="-mx-4" on:click={addDescription}>
        <PlusIcon class="mr-2 h-4 w-4" />
        Add description
      </Button>
    {/if}

    <div class="space-y-2" bind:this={el} use:autoAnimate>
      <SortableList
        class="space-y-4 pb-2"
        handle=".handler"
        animation={200}
        onEnd={(event) => {
          if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
            swap(event.oldIndex, event.newIndex)
          }
        }}
      >
        {#each formFields as formField (formField.fieldId)}
          {@const field = schema.get(formField.fieldId)}
          {#if field}
            {@const isSelected = $selectedFieldId === field.id.value}
            <label class={cn("block")} data-field-id={formField.fieldId}>
              <input type="radio" class="hidden" bind:group={$selectedFieldId} value={field.id.value} />
              <Collapsible.Root
                open={isSelected}
                onOpenChange={(open) => {
                  if (!open) {
                    $selectedFieldId = null
                  }
                }}
                class={cn(
                  "bg-background relative -mx-4 space-y-2 rounded-md border-2 border-transparent p-0 px-4 transition-all",
                  isSelected ? "border-primary shadow-lg" : "hover:bg-muted/50",
                )}
              >
                {#if isSelected}
                  <button type="button" class="handler bg-primary absolute -left-2 top-2 rounded-sm py-2">
                    <GripVerticalIcon class="h-4 w-4 text-white" />
                  </button>
                {/if}
                <div class={cn("cursor-pointer space-y-2 py-2 pb-4")}>
                  <div class="text-md flex items-center gap-2 font-medium">
                    <FieldIcon {field} type={field.type} class="h-4 w-4" />
                    <span>
                      {field.name.value}
                    </span>
                    {#if formField.getRequired(field)}
                      <span class="text-red-500">*</span>
                    {/if}
                    {#if formField.conditionEnabled && formField.hasCondition}
                      <span
                        class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                      >
                        condition
                      </span>
                    {/if}
                    {#if form.getIsFormFieldContionInValid(formField.fieldId)}
                      <span
                        class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
                      >
                        invalid condition
                      </span>
                    {/if}
                  </div>
                  <FieldControl
                    {field}
                    tableId={$table.id.value}
                    bind:value={formField.defaultValue}
                    class="bg-background"
                    on:change={setForm}
                    placeholder={`set default value for ${field.name.value}`}
                  />
                </div>
                <Collapsible.Content>
                  <FormFieldOptions {field} bind:formField bind:form class="-mx-4" />
                </Collapsible.Content>
              </Collapsible.Root>
            </label>
          {/if}
        {/each}
      </SortableList>

      <div class="flex justify-between">
        <div></div>
        <Button>Submit</Button>
      </div>
    </div>
  </div>
</div>
