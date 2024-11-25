<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { Toggle } from "$lib/components/ui/toggle/index.js"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { defaults, superForm } from "sveltekit-superforms"
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
  import { LL } from '@undb/i18n/client'

  const table = getTable()

  const setTableRLSMutation = createMutation({
    mutationKey: ["table", $table.id.value, "rls", "create"],
    mutationFn: trpc.table.rls.set.mutate,
    onSuccess(data, variables, context) {
      toast.success($LL.table.authz.created())
      closeModal(CREATE_RLS_MODAL)
    },
    onError(error, variables, context) {
      toast.error($LL.table.authz.failed())
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
        label: $LL.table.authz.subject[$formData.subject](),
        value: $formData.subject,
      }
    : undefined

  $: selectedAction = $formData.action
    ? {
        label: $LL.table.authz.actions[$formData.action](),
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
      <Form.Label>{$LL.common.name()}</Form.Label>
      <Input {...attrs} bind:value={$formData.name} placeholder={$LL.table.authz.rlsName()} />
    </Form.Control>
    <Form.Description>{$LL.table.authz.giveYourRLSName()}</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <div class="flex items-end gap-2">
    <Form.Field {form} name="subject" class="flex-1">
      <Form.Control let:attrs>
        <Form.Label>{$LL.table.authz.subjectName()}</Form.Label>
        <Select.Root
          selected={selectedSubject}
          onSelectedChange={(v) => {
            v && ($formData.subject = v.value)
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value  />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="any" label={$LL.table.authz.subject.any()} />
            <Select.Item value="nobody" label={$LL.table.authz.subject.nobody()} />
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.subject} name={attrs.name} />
      </Form.Control>
    </Form.Field>

    <Form.Field {form} name="allow">
      <Form.Control let:attrs>
        <Toggle aria-label="toggle bold" class="text-xs" on:click={() => ($formData.allow = !$formData.allow)}>
          {$formData.allow ? $LL.table.authz.allow() : $LL.table.authz.deny()}
        </Toggle>
      </Form.Control>
    </Form.Field>

    <Form.Field {form} name="action" class="flex-1">
      <Form.Control let:attrs>
        <Form.Label>{$LL.table.authz.action()}</Form.Label>
        <Select.Root
          selected={selectedAction}
          onSelectedChange={(v) => {
            v && ($formData.action = v.value)
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="read" label={$LL.table.authz.actions.read()} />
            <Select.Item value="create" disabled label={$LL.table.authz.actions.create()} />
            <Select.Item value="update" disabled label={$LL.table.authz.actions.update()} />
            <Select.Item value="delete" disabled label={$LL.table.authz.actions.delete()} />
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.action} name={attrs.name} />
      </Form.Control>
    </Form.Field>
  </div>

  <Form.Field {form} name="condition">
    <Form.Control let:attrs>
      <Form.Label class="flex items-center gap-2" for="enableCondition">
        {$LL.table.authz.matchesConditions()}
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
  <Form.Button class="w-full" disabled={!!$allErrors.length || !dirty}>{$LL.common.submit()}</Form.Button>

  <!-- {#if browser}
    <SuperDebug data={$formData} />
  {/if} -->
</form>
