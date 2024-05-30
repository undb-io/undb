<script lang="ts">
  import CreateRecordButton from "../create-record/create-record-button.svelte"
</script>

<div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
  <div class="flex flex-col items-center gap-1 space-y-2 text-center">
    <h3 class="text-2xl font-bold tracking-tight">You have no records</h3>
    <p class="text-muted-foreground text-sm">
      You can click button or use shortcut <code class="bg-muted rounded px-[0.3rem] py-[0.2rem]">Ctrl + R</code> and create
      your first record
    </p>
    <CreateRecordButton variant="default" size="default" />
  </div>
</div>
