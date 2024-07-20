<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import { LogsIcon } from "lucide-svelte"
  import InvitationsList from "./invitations-list.svelte"
</script>

<Dialog.Root>
  <Dialog.Trigger asChild let:builder>
    <Button size="sm" variant="outline" builders={[builder]}>
      <slot>
        <LogsIcon class="mr-2 h-4 w-4" />
        Invitations
      </slot>
    </Button>
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-1/2 max-w-1/2 !w-1/2">
    <Dialog.Header>
      <Dialog.Title>Invitation List</Dialog.Title>
    </Dialog.Header>

    <InvitationsList />
  </Dialog.Content>
</Dialog.Root>
