<script lang="ts">
  import CreateRecordButton from "../create-record/create-record-button.svelte"

  export let readonly = false
</script>

<div class="flex max-w-full flex-1 items-center justify-center shadow-sm">
  <div class="flex flex-col items-center gap-1 space-y-2 text-center">
    <h3 class="text-2xl font-bold tracking-tight">You have no records</h3>
    {#if !readonly}
      <p class="text-muted-foreground text-sm">
        You can click button or use shortcut <code class="bg-muted rounded px-[0.3rem] py-[0.2rem]">Ctrl + R</code> and create
        your first record
      </p>
      <CreateRecordButton variant="default" size="default" />
    {/if}
  </div>
</div>
