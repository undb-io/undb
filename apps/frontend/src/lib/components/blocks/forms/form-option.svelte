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
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { EllipsisIcon, TrashIcon } from "lucide-svelte"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"

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
      await goto(`/t/${$table.id.value}`)
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

  const deleteFormMutation = createMutation({
    mutationKey: ["table", $table.id.value, "deleteForm"],
    mutationFn: trpc.table.form.delete.mutate,
    async onSuccess() {
      await invalidate(`table:${$table.id.value}`)
    },
  })

  const deleteForm = async () => {
    await $deleteFormMutation.mutateAsync({
      tableId: $table.id.value,
      id: form.id,
    })
    confirmDelete = false
  }

  let confirmDelete = false
</script>

<div class="space-y-4 p-4">
  <div class="flex items-center justify-between">
    <h3 class="font-semibold">Form Setting</h3>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <EllipsisIcon class="text-muted-foreground h-4 w-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-48">
        <DropdownMenu.Group>
          <DropdownMenu.Item
            on:click={() => (confirmDelete = true)}
            class="hover:text-500 flex items-center text-xs text-red-500 transition-colors hover:bg-red-100"
          >
            <TrashIcon class="mr-2 h-3 w-3" />
            Delete form
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>

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
        Auto add new field to form when create field
      </Label>
      <p class="text-muted-foreground text-sm">When a new field is created, it will be automatically set to show.</p>
    </div>
  </div>
</div>

<AlertDialog.Root bind:open={confirmDelete}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete form: {form.name}?</AlertDialog.Title>
      <AlertDialog.Description>Form will be deleted permanently.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={deleteForm}>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
