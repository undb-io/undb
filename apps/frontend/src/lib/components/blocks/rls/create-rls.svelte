<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { Toggle } from "$lib/components/ui/toggle/index.js"
  import { zodClient } from "sveltekit-superforms/adapters"
  import SuperDebug, { defaults, superForm } from "sveltekit-superforms"
  import { browser } from "$app/environment"
  import * as Form from "$lib/components/ui/form/index.js"
  import * as Select from "$lib/components/ui/select/index.js"
  import { RLSIdVO, rlsDTO, type MaybeConditionGroup, parseValidViewFilter } from "@undb/table"
  import { Switch } from "$lib/components/ui/switch"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { writable } from "svelte/store"
  import type { ZodUndefined } from "@undb/zod"
  import { toast } from "svelte-sonner"
  import { CREATE_RLS_MODAL, closeModal } from "$lib/store/modal.store"
  import Input from "$lib/components/ui/input/input.svelte"
  import { updated } from "$app/stores"

  const table = getTable()

  const setTableRLSMutation = createMutation({
    mutationKey: ["table", $table.id.value, "rls", "create"],
    mutationFn: trpc.table.rls.set.mutate,
    onSuccess(data, variables, context) {
      toast.success("RLS created")
      closeModal(CREATE_RLS_MODAL)
    },
    onError(error, variables, context) {
      toast.error("Failed to create RLS")
    },
  })

  const form = superForm(
    defaults(
      {
        id: RLSIdVO.create().value,
        name: "",
        enabled: true,
        allow: true,
        action: "read",
        subject: "any",
        condition: undefined,
      },
      zodClient(rlsDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validationMethod: "auto",
      validators: zodClient(rlsDTO),
      onUpdate(event) {
        const data = event.form.data

        $setTableRLSMutation.mutate({
          tableId: $table.id.value,
          rls: data,
        })
      },
    },
  )

  const { form: formData, enhance, allErrors, tainted } = form

  $: selectedSubject = $formData.subject
    ? {
        label: $formData.subject,
        value: $formData.subject,
      }
    : undefined

  $: selectedAction = $formData.action
    ? {
        label: $formData.action,
        value: $formData.action,
      }
    : undefined

  let enableContion = false
  let enableUpdateCondition = false

  const condition = writable<MaybeConditionGroup<ZodUndefined> | undefined>()
  $: validCondition = $condition ? parseValidViewFilter($table.schema, $condition) : undefined
  $: validCondition, ($formData.condition = validCondition)

  const updateCondition = writable<MaybeConditionGroup<ZodUndefined> | undefined>()
  $: validUpdateCondition = $updateCondition ? parseValidViewFilter($table.schema, $updateCondition) : undefined
  $: validUpdateCondition, ($formData.updateCondition = validUpdateCondition)

  $: dirty = !!$tainted
</script>

<form method="POST" class="w-full space-y-3" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Name</Form.Label>
      <Input {...attrs} bind:value={$formData.name} placeholder="record level security name" />
    </Form.Control>
    <Form.Description>Give your RLS a name</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <div class="flex items-end gap-2">
    <Form.Field {form} name="subject" class="flex-1">
      <Form.Control let:attrs>
        <Form.Label>Subject</Form.Label>
        <Select.Root
          selected={selectedSubject}
          onSelectedChange={(v) => {
            v && ($formData.subject = v.value)
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Select a verified email to display" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="any" label="any" />
            <Select.Item value="nobody" label="nobody" />
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.subject} name={attrs.name} />
      </Form.Control>
    </Form.Field>

    <Form.Field {form} name="allow">
      <Form.Control let:attrs>
        <Toggle aria-label="toggle bold" class="text-xs" on:click={() => ($formData.allow = !$formData.allow)}>
          {$formData.allow ? "allow" : "deny"}
        </Toggle>
      </Form.Control>
    </Form.Field>

    <Form.Field {form} name="action" class="flex-1">
      <Form.Control let:attrs>
        <Form.Label>Action</Form.Label>
        <Select.Root
          selected={selectedAction}
          onSelectedChange={(v) => {
            v && ($formData.action = v.value)
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Select a verified email to display" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="read" label="read" />
            <Select.Item value="create" label="create" />
            <Select.Item value="update" label="update" />
            <Select.Item value="delete" label="delete" />
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.action} name={attrs.name} />
      </Form.Control>
    </Form.Field>
  </div>

  <Form.Field {form} name="condition">
    <Form.Control let:attrs>
      <Form.Label class="flex items-center gap-2" for="enableCondition">
        Enable condition
        <Switch bind:checked={enableContion} id="enableCondition" />
      </Form.Label>
      {#if enableContion}
        <FiltersEditor
          samewWidth={false}
          class="rounded-sm border-gray-100 bg-gray-50 shadow-inner"
          table={$table}
          bind:value={$condition}
        />
      {/if}
    </Form.Control>
  </Form.Field>
  {#if $formData.action === "update"}
    <Form.Field {form} name="updateCondition">
      <Form.Control let:attrs>
        <Form.Label class="flex items-center gap-2" for="updateCondition">
          Enable update condition
          <Switch bind:checked={enableUpdateCondition} id="updateCondition" />
        </Form.Label>
        {#if enableUpdateCondition}
          <FiltersEditor
            samewWidth={false}
            class="rounded-sm border-gray-100 bg-gray-50 shadow-inner"
            table={$table}
            bind:value={$updateCondition}
          />
        {/if}
      </Form.Control>
    </Form.Field>
  {/if}
  <Form.Button class="w-full" disabled={!!$allErrors.length || !dirty}>Submit</Form.Button>

  <!-- {#if browser}
    <SuperDebug data={$formData} />
  {/if} -->
</form>
