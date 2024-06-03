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
  import { RLSIdVO, rlsDTO } from "@undb/table"

  const table = getTable()

  const createRLSMutation = createMutation({
    mutationKey: ["table", $table.id.value, "rls", "create"],
    mutationFn: trpc.table.rls.set.mutate,
  })

  const form = superForm(
    defaults(
      {
        id: RLSIdVO.create().value,
        allow: true,
        action: "read",
        subject: "any",
        condition: undefined,
      },
      zodClient(rlsDTO),
    ),
    {
      SPA: true,
      validators: zodClient(rlsDTO),
      onUpdate(event) {
        console.log(event)
      },
    },
  )

  const { form: formData, enhance } = form

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
</script>

<form method="POST" class="w-full space-y-6" use:enhance>
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

  <Form.Button class="w-full">Submit</Form.Button>

  {#if browser}
    <SuperDebug data={$formData} />
  {/if}
</form>
