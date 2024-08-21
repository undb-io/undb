<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import type { FormVO, IColors } from "@undb/table"
  import { COLORS, FormOptionVO } from "@undb/table"
  import { tick } from "svelte"
  import { getFormBgColor, getFormBorderColor, getFormSelectedColor } from "./form-bg-color"
  import { invalidate } from "$app/navigation"
  import { Checkbox } from "$lib/components/ui/checkbox/index.js"
  import { Label } from "$lib/components/ui/label/index.js"

  const table = getTable()
  export let form: FormVO

  $: formOption = form.option ?? FormOptionVO.default()

  const onChangeBackgroundColor = async (color: IColors) => {
    formOption.backgroundColor = color
    form.option = formOption
    await setForm()
  }

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
</script>

<div class="space-y-4 p-4">
  <h3 class="font-semibold">Form Setting</h3>

  <div class="space-y-2">
    <p class="text-muted-foreground">Background color</p>
    <div class="flex flex-wrap gap-2">
      {#each COLORS as color}
        {@const isSelected = color === formOption.backgroundColor}
        <label class="cursor-pointer">
          <input
            hidden
            type="radio"
            bind:group={formOption.backgroundColor}
            on:change={() => onChangeBackgroundColor(color)}
            value={color}
          />
          <div
            class={cn(
              "h-8 w-8 rounded-sm border transition-colors",
              getFormBgColor(color),
              getFormBorderColor(color),
              isSelected && getFormSelectedColor(color),
              isSelected && "shadow-primary shadow-sm",
            )}
          ></div>
        </label>
      {/each}
    </div>
  </div>

  <div class="items-top flex space-x-2">
    <Checkbox
      id="autoAddNewField"
      bind:checked={formOption.autoAddNewField}
      onCheckedChange={(checked) => {
        formOption.autoAddNewField = !!checked
        form.option = formOption
        setForm()
      }}
    />
    <div class="grid gap-1.5 leading-none">
      <Label
        for="autoAddNewField"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Auto show new field
      </Label>
      <p class="text-muted-foreground text-sm">When a new field is created, it will be automatically set to show.</p>
    </div>
  </div>
</div>
