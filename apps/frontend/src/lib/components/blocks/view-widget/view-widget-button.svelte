<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { toggleModal, VIEW_WIDGET_MODAL } from "$lib/store/modal.store"
  import { PlugIcon } from "lucide-svelte"
</script>

<Button on:click={() => toggleModal(VIEW_WIDGET_MODAL)} variant="outline" size="sm">
  <PlugIcon class="mr-2 size-4" />
  Widget
</Button>
