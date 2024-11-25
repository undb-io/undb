<script lang="ts">
  import {
    type FormFieldVO,
    type Field,
    type FormVO,
    type MaybeConditionGroup,
    toMaybeConditionGroup,
    parseValidViewFilter,
  } from "@undb/table"
  import { Switch } from "$lib/components/ui/switch"
  import { Label } from "$lib/components/ui/label"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import { tick } from "svelte"
  import { EyeClosed, EyeOpen } from "svelte-radix"
  import { cn } from "$lib/utils"
  import type { ZodUndefined } from "@undb/zod"
  import { writable } from "svelte/store"
  import { Button } from "$lib/components/ui/button"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import {LL} from '@undb/i18n/client'

  const table = getTable()

  export let formField: FormFieldVO
  export let form: FormVO
  export let field: Field

  $: required = formField.getRequired(field)

  const setFormMutation = createMutation({
    mutationFn: trpc.table.form.set.mutate,
    mutationKey: ["table", $table.id.value, "setForm"],
  })

  const setForm = async () => {
    await tick()
    $setFormMutation.mutate({
      tableId: $table.id.value,
      form: form.toJSON(),
    })
  }

  const condition = writable<MaybeConditionGroup<ZodUndefined> | undefined>()
  $: validCondition = $condition ? parseValidViewFilter($table.schema, $condition) : undefined

  $: form, condition.set(formField.condition && toMaybeConditionGroup(formField.condition))

  const updateCondition = () => {
    if (!validCondition) {
      return
    }

    formField.condition = validCondition
    setForm()
  }

  $: previousFields = form.getPreviousFields(field.id.value) ?? []
  $: disabled = required && !formField.defaultValue
</script>

<div
  class={cn(
    "flex items-center justify-between rounded-b-md border-t bg-neutral-50 px-4 py-2 text-xs",
    $$restProps.class,
    formField.conditionEnabled && !!previousFields.length && "pb-4",
  )}
>
  <Collapsible.Root
    class="w-full"
    open={formField.conditionEnabled && !!previousFields.length}
    onOpenChange={(open) => {
      if (!open) {
        formField.conditionEnabled = false
      }
    }}
  >
    <div class="flex items-center justify-between">
      <div class="text-muted-foreground flex items-center gap-2 text-xs">
        <FieldIcon {field} type={field.type} class="h-3 w-3" />
        <span>
          {field.name.value}
        </span>
      </div>

      <div class="flex items-center gap-3">
        <Label class="flex items-center gap-2 text-xs">
          {#if !previousFields.length}
            <Switch size="sm" disabled class="text-sm" checked={false} />
          {:else}
            <Switch size="sm" class="text-sm" bind:checked={formField.conditionEnabled} on:click={setForm} />
          {/if}
          <span>{$LL.table.form.enableCondition()}</span>
        </Label>
        <Label class="flex items-center gap-2 text-xs">
          <Switch
            class="text-sm"
            size="sm"
            checked={required}
            disabled={field.required}
            onCheckedChange={async (checked) => {
              formField.setRequired(field, checked)
              await tick()
              form = form

              setForm()
            }}
          />
          <span>{$LL.common.required()}</span>
        </Label>

        <Label class={cn(disabled ? "cursor-not-allowed" : "cursor-pointer")}>
          <Checkbox
            class="hidden"
            bind:checked={formField.hidden}
            disabled={disabled || field.type === "button"}
            onCheckedChange={async () => {
              await tick()
              form = form
              setForm()
            }}
          />
          {#if formField.hidden}
            <EyeClosed class="h-4 w-4" />
          {:else}
            <EyeOpen class="h-4 w-4" />
          {/if}
        </Label>
      </div>
    </div>
    <Collapsible.Content class="mt-4">
      <FiltersEditor
        filter={(field) => previousFields.map((f) => f.fieldId).includes(field.id)}
        bind:value={$condition}
        table={$table}
        class="rounded-sm border"
        disabled={field.type === "attachment"}
        on:submit={updateCondition}
      >
        <Button size="xs" slot="footer" on:click={updateCondition}>
          {$LL.common.submit()}
        </Button>
      </FiltersEditor>
    </Collapsible.Content>
  </Collapsible.Root>
</div>
