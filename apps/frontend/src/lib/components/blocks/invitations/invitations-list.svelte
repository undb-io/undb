<script lang="ts">
  import { GetInvitationsStore } from "$houdini"
  import { onMount } from "svelte"
  import { Badge } from "$lib/components/ui/badge"
  import * as Table from "$lib/components/ui/table"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import Role from "../member/role.svelte"
  import { EllipsisIcon, TrashIcon } from "lucide-svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { hasPermission } from "$lib/store/space-member.store"
  import { LL } from "@undb/i18n/client"

  const store = new GetInvitationsStore()

  onMount(() => {
    store.fetch({ variables: { status: "pending" }, policy: "NetworkOnly" })
  })

  $: invitations = $store.data?.invitations ?? []

  const deleteInvitationMutation = createMutation({
    mutationFn: trpc.authz.deleteInvitation.mutate,
    onSuccess(data, variables, context) {
      store.fetch({ variables: { status: "pending" }, policy: "NetworkOnly" })
    },
  })

  const deleteInvitation = (id: string) => {
    $deleteInvitationMutation.mutate({ id })
  }
</script>

<Table.Root>
  <Table.Caption>{$LL.space.pendingInvitations()}</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>{$LL.common.email()}</Table.Head>
      <Table.Head>{$LL.common.status()}</Table.Head>
      <Table.Head>{$LL.common.role()}</Table.Head>
      <Table.Head>{$LL.space.invitedAt()}</Table.Head>
      <Table.Head>{$LL.common.action()}</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each invitations as invitation (invitation.id)}
      <Table.Row>
        <Table.Cell class="font-medium">{invitation.email}</Table.Cell>
        <Table.Cell>
          <Badge>
            {invitation.status}
          </Badge>
        </Table.Cell>
        <Table.Cell>
          <Role role={invitation.role} />
        </Table.Cell>
        <Table.Cell>
          {invitation.invitedAt}
        </Table.Cell>
        <Table.Cell>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <EllipsisIcon class="h-3 w-3" />
            </DropdownMenu.Trigger>
            {#if $hasPermission("authz:deleteInvitation")}
              <DropdownMenu.Content class="w-[200px]">
                <DropdownMenu.Item
                  class="text-xs text-red-500 hover:!bg-red-50 hover:!text-red-500"
                  on:click={() => deleteInvitation(invitation.id)}
                >
                  <TrashIcon class="mr-2 h-3 w-3" />
                  {$LL.space.deleteInvitation()}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            {/if}
          </DropdownMenu.Root>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
