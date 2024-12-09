<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar"
  import { IMPORT_TEMPLATE_MODAL, openModal } from "$lib/store/modal.store"
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>Data</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item
        class="text-sm"
        on:click={() => {
          openModal(IMPORT_TEMPLATE_MODAL)
        }}
      >
        Import From Template
      </Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item>Share</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
