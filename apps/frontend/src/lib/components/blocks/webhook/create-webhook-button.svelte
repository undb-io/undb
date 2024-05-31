<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import { CREATE_WEBHOOK_MODAL, toggleModal } from "$lib/store/modal.store"
  import { WebhookIcon } from "lucide-svelte"
</script>

<Button {...$$restProps} on:click={() => toggleModal(CREATE_WEBHOOK_MODAL)}>
  <WebhookIcon class="mr-2 h-4 w-4" />
  Create Webhook
</Button>
