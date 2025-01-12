<script lang="ts">
  import { page } from "$app/state"
  import { Button } from "$lib/components/ui/button"
</script>

<section class="flex h-full items-center p-16 dark:bg-gray-50 dark:text-gray-800">
  <div class="container mx-auto my-8 flex flex-col items-center justify-center px-5">
    <div class="max-w-md text-center">
      <h2 class="mb-8 text-6xl font-extrabold dark:text-gray-400">
        <span class="sr-only">Error</span>{page.status}
      </h2>
      <p class="mb-5 text-2xl font-semibold md:text-3xl">
        {page.error?.message}
      </p>
      <Button href="/">Back to homepage</Button>
    </div>
  </div>
</section>
