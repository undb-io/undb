<script>
  import Header from "$lib/components/header/header.svelte"
  import Footer from "$lib/components/footer/footer.svelte"
  import { dev } from "$app/environment"

  import "../app.css"
</script>

<div class="app flex min-h-screen flex-col">
  <Header />
  <main class="flex-1">
    <slot></slot>
  </main>
  <Footer />
</div>

<svelte:head>
  {#if !dev}
    <script defer src="/script.js" data-website-id="4187c9f3-1c0c-4343-854c-beb9320361b0"></script>
  {/if}
</svelte:head>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
</style>
