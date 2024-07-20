<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import type { IWorkspaceMemberWithoutOwner } from "@undb/authz"
  import { LL } from "@undb/i18n/client"

  export let role: IWorkspaceMemberWithoutOwner = "viewer"

  $: selectedRole = role
    ? {
        label: role,
        value: $LL.table.workspaceRoles[role](),
      }
    : undefined
</script>

<Select.Root
  selected={selectedRole}
  onSelectedChange={(v) => {
    if (v) {
      role = v.label
    }
  }}
>
  <Select.Trigger>
    <Select.Value placeholder="Theme" />
  </Select.Trigger>
  <Select.Content sameWidth>
    <Select.Item value="admin">Admin</Select.Item>
    <Select.Item value="viewer">Viewer</Select.Item>
  </Select.Content>
</Select.Root>
