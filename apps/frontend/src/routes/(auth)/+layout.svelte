<script lang="ts">
  import LanguagePicker from "$lib/components/blocks/language/language-picker.svelte"
</script>

<main class="flex h-screen w-screen items-center justify-center">
  <slot />
  <div class="fixed right-5 top-5">
    <LanguagePicker />
  </div>
</main>
