<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { Button } from "$lib/components/ui/button"
  import * as Popover from "$lib/components/ui/popover"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { createViewDTO } from "@undb/table"
  import { getNextName } from "@undb/utils"
  import { PlusCircleIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Input } from "$lib/components/ui/input"
  import { cn } from "$lib/utils"
  import { hasPermission } from "$lib/store/space-member.store"
  import { LoaderCircleIcon } from "lucide-svelte"
  import ViewTypePicker from "./view-type-picker.svelte"
  import { goto, invalidate, invalidateAll } from "$app/navigation"
  import { getTable } from "$lib/store/table.store"
  import FieldPicker from "../field-picker/field-picker.svelte"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { CircleHelpIcon } from "lucide-svelte"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"
  import { type ICreateViewCommand } from "@undb/commands"
    import { getIsPlayground } from "$lib/store/playground.svelte"

  let open = false

  const table = getTable()

  export let tableId: string
  export let viewNames: string[]

  const dataService = getDataService()
  const isPlayground = getIsPlayground()

  const createViewMutation = createMutation({
    mutationFn: dataService.table.view.createView,
    mutationKey: ["table", tableId, "createView"],
    async onSuccess(data) {
      viewNames = [...viewNames, $formData.name]
      toast.success($LL.table.view.created())
      reset()
      if (isPlayground) {
        await invalidateAll()
        await goto(`/playground/bases/${data.baseId}/t/${tableId}/${data.viewId}`)
      } else {
        await invalidate(`undb:table:${tableId}`)
        await goto(`/t/${tableId}/${data.viewId}`)
      }
    },
    onError(e) {
      toast.error(e.message)
    },
    onSettled() {
      open = false
    },
  })

  const form = superForm(
    defaults(
      {
        name: getNextName(viewNames, "View"),
        type: "grid",
      },
      zodClient(createViewDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(createViewDTO),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) return

        $createViewMutation.mutate({ tableId, ...event.form.data })
      },
    },
  )

  const { enhance, form: formData, reset } = form
</script>

{#if $hasPermission("table:update")}
  <Popover.Root bind:open>
    <Popover.Trigger asChild let:builder>
      <Button class={cn("mt-4", $$restProps.class)} builders={[builder]} {...$$restProps}>
        <slot>
          <PlusCircleIcon class="mr-2 h-4 w-4" />
          {$LL.table.view.create()}
        </slot>
      </Button>
    </Popover.Trigger>
    <Popover.Content>
      <form method="POST" use:enhance>
        <Form.Field {form} name="name">
          <Form.Control let:attrs>
            <Form.Label>{$LL.common.name()}</Form.Label>
            <Input {...attrs} bind:value={$formData.name} />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="type">
          <Form.Control let:attrs>
            <Form.Label>{$LL.table.view.type()}</Form.Label>
            <ViewTypePicker
              {...attrs}
              bind:value={$formData.type}
              onValueChange={(type) => {
                if (type === "calendar") {
                  const field = $table?.schema.getCalendarFields().at(0)?.id.value
                  formData.update((f) => ({ ...f, calendar: { field } }))
                } else if (type === "gallery") {
                  const field = $table?.schema.getGalleryFields().at(0)?.id.value
                  formData.update((f) => ({ ...f, gallery: { field } }))
                } else if (type === "kanban") {
                  const field = $table?.schema.getKanbanFields().at(0)?.id.value
                  formData.update((f) => ({ ...f, kanban: { field } }))
                }
              }}
            />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>
        {#if $table}
          {#if $formData.type === "calendar" && $formData.calendar}
            <Form.Field {form} name="calendar.field">
              <Form.Control let:attrs>
                <Form.Label class="flex items-center gap-2">
                  {$LL.table.view.calendar.field()}
                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <CircleHelpIcon class="size-4" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>{$LL.table.view.calendar.groupBy()}</p>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Form.Label>
                <FieldPicker
                  {...attrs}
                  value={$formData.calendar.field}
                  onValueChange={(field) => {
                    if ($formData.calendar) {
                      $formData.calendar.field = field
                    } else {
                      $formData.calendar = { field }
                    }
                  }}
                  class="w-full"
                  filter={(f) =>
                    $table.schema
                      .getCalendarFields()
                      .map((f) => f.id.value)
                      .includes(f.id)}
                >
                  <div slot="empty">{$LL.table.view.calendar.noDateField()}</div>
                </FieldPicker>
              </Form.Control>
              <Form.Description />
              <Form.FieldErrors />
            </Form.Field>
          {:else if $formData.type === "gallery" && $formData.gallery}
            <Form.Field {form} name="gallery.field">
              <Form.Control let:attrs>
                <Form.Label class="flex items-center gap-2">
                  {$LL.table.view.gallery.field()}
                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <CircleHelpIcon class="size-4" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>{$LL.table.view.gallery.groupBy()}</p>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Form.Label>
                <FieldPicker
                  {...attrs}
                  value={$formData.gallery.field}
                  onValueChange={(field) => {
                    if ($formData.gallery) {
                      $formData.gallery.field = field
                    } else {
                      $formData.gallery = { field }
                    }
                  }}
                  class="w-full"
                  filter={(f) =>
                    $table.schema
                      .getGalleryFields()
                      .map((f) => f.id.value)
                      .includes(f.id)}
                >
                  <div slot="empty">{$LL.table.view.gallery.noAttachmentField()}</div>
                </FieldPicker>
              </Form.Control>
              <Form.Description />
              <Form.FieldErrors />
            </Form.Field>
          {:else if $formData.type === "kanban" && $formData.kanban}
            <Form.Field {form} name="kanban.field">
              <Form.Control let:attrs>
                <Form.Label class="flex items-center gap-2">
                  {$LL.table.view.kanban.field()}
                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <CircleHelpIcon class="size-4" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>{$LL.table.view.kanban.groupBy()}</p>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Form.Label>
                <FieldPicker
                  {...attrs}
                  value={$formData.kanban.field}
                  onValueChange={(field) => {
                    if ($formData.kanban) {
                      $formData.kanban.field = field
                    } else {
                      $formData.kanban = { field }
                    }
                  }}
                  class="w-full"
                  filter={(f) =>
                    $table.schema
                      .getKanbanFields()
                      .map((f) => f.id.value)
                      .includes(f.id)}
                >
                  <div slot="empty">{$LL.table.view.kanban.noSelectField()}</div>
                </FieldPicker>
              </Form.Control>
              <Form.Description />
              <Form.FieldErrors />
            </Form.Field>
          {/if}
        {/if}

        <Form.FormButton disabled={$createViewMutation.isPending} class="w-full">
          {#if $createViewMutation.isPending}
            <LoaderCircleIcon class="mr-2 h-4 w-4" />
          {/if}
          {$LL.common.create()}
        </Form.FormButton>
      </form>
    </Popover.Content>
  </Popover.Root>
{/if}
