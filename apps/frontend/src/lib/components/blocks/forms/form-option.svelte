<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import { CopyIcon, LoaderCircleIcon } from "lucide-svelte"
  import type { FormVO, IColors } from "@undb/table"
  import { COLORS, duplicateFormDTO, FormOptionVO } from "@undb/table"
  import { tick } from "svelte"
  import { getFormBgColor, getFormBorderColor, getFormSelectedColor } from "./form-bg-color"
  import { goto, invalidate } from "$app/navigation"
  import { Checkbox } from "$lib/components/ui/checkbox/index.js"
  import { Label } from "$lib/components/ui/label/index.js"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { EllipsisIcon, TrashIcon } from "lucide-svelte"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { Button } from "$lib/components/ui/button"
  import { getNextName } from "@undb/utils"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Dialog from "$lib/components/ui/dialog"
  import * as Form from "$lib/components/ui/form/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import { formId } from "$lib/store/tab.store"
  import { toast } from "svelte-sonner"
  import { LL } from "@undb/i18n/client"

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

  const deleteFormMutation = createMutation({
    mutationKey: ["table", $table.id.value, "deleteForm"],
    mutationFn: trpc.table.form.delete.mutate,
    async onSuccess() {
      await invalidate(`undb:table:${$table.id.value}`)
      await goto(`/t/${$table.id.value}`)
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

  const duplicateFormMutation = createMutation({
    mutationKey: ["table", $table.id.value, "duplicateForm"],
    mutationFn: trpc.table.form.duplicate.mutate,
    async onSuccess(data) {
      toast.success($LL.table.form.duplicateSuccess())
      duplicateFormDialog = false
      await invalidate(`undb:table:${$table.id.value}`)
      formId.set(data.formId)
    },
  })

  const frm = superForm(
    defaults(
      {
        id: form.id,
        name: getNextName($table.forms?.forms.map((f) => f.name) ?? [], form.name),
      },
      zodClient(duplicateFormDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(duplicateFormDTO),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) return

        $duplicateFormMutation.mutate({ ...event.form.data, tableId: $table.id.value })
      },
    },
  )

  let duplicateFormDialog = false

  const { enhance, form: formData } = frm
</script>

<div class="space-y-4 p-4">
  <div class="flex items-center justify-between">
    <h3 class="font-semibold">{$LL.table.form.formSetting()}</h3>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <EllipsisIcon class="text-muted-foreground h-4 w-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-48">
        <DropdownMenu.Group>
          <DropdownMenu.Item class="text-xs" on:click={() => (duplicateFormDialog = true)}>
            <CopyIcon class="mr-2 h-3 w-3" />
            {$LL.table.form.duplicateForm()}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            on:click={() => (confirmDelete = true)}
            class="hover:text-500 flex items-center text-xs text-red-500 transition-colors hover:bg-red-100"
          >
            <TrashIcon class="mr-2 h-3 w-3" />
            {$LL.table.form.deleteForm()}
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>

  <div class="space-y-2">
    <p class="text-muted-foreground">{$LL.table.form.backgroundColor()}</p>
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
        {$LL.table.form.autoAddNewField()}
      </Label>
      <p class="text-muted-foreground text-sm">
        {$LL.table.form.autoAddNewFieldDescription()}
      </p>
    </div>
  </div>
</div>

<AlertDialog.Root bind:open={confirmDelete}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{$LL.table.form.deleteFormConfirm({name: form.name})}</AlertDialog.Title>
      <AlertDialog.Description>{$LL.table.form.deleteFormDescription()}</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
      <AlertDialog.Action asChild let:builder>
        <Button
          variant="destructive"
          builders={[builder]}
          on:click={deleteForm}
          disabled={$deleteFormMutation.isPending}
        >
          {#if $deleteFormMutation.isPending}
            <LoaderCircleIcon class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          {$LL.table.form.deleteForm()}
        </Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root bind:open={duplicateFormDialog}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$LL.table.form.duplicateFormDialog({name: form.name})}</Dialog.Title>
      <Dialog.Description>{$LL.table.form.duplicateFormDialogDescription()}</Dialog.Description>
    </Dialog.Header>
    <form action="/?/username" method="POST" class="space-y-4" use:enhance>
      <Form.Field form={frm} name="name">
        <Form.Control let:attrs>
          <Form.Label>{$LL.common.name()}</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.Description>{$LL.table.form.setName()}</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Button disabled={$duplicateFormMutation.isPending} class="w-full">
        {$LL.table.form.duplicateForm()}
      </Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
