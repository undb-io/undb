<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import type { ISpaceMemberWithoutOwner } from "@undb/authz"
  import { LL } from "@undb/i18n/client"
  import Role from "../member/role.svelte"

  export let role: ISpaceMemberWithoutOwner = "editor"

  $: selectedRole = role
    ? {
        label: $LL.roles[role](),
        value: role,
      }
    : undefined
</script>

<Select.Root
  selected={selectedRole}
  onSelectedChange={(v) => {
    if (v) {
      role = v.value
    }
  }}
>
  <Select.Trigger>
    <Select.Value asChild placeholder="Theme">
      {#key selectedRole}
        {#if selectedRole}
          <Role role={selectedRole.value} />
        {/if}
      {/key}
    </Select.Value>
  </Select.Trigger>
  <Select.Content sameWidth>
    <Select.Item value="admin">
      <Role role="admin" />
    </Select.Item>
    <Select.Item value="editor">
      <Role role="editor" />
    </Select.Item>
    <Select.Item value="viewer">
      <Role role="viewer" />
    </Select.Item>
  </Select.Content>
</Select.Root>
