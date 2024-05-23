<script lang="ts">
  import { Input } from "$lib/components/ui/input"
  import { queryParam } from "sveltekit-search-params"
  import { debounce } from "radash"
  import { SearchIcon } from "lucide-svelte"

  const q = queryParam("q")
  const setQ = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    q.set(value)
  }

  const onInput = debounce({ delay: 300 }, setQ)
</script>

<div class="flex items-center gap-2">
  <SearchIcon class="text-muted-foreground h-4 w-4" />
  <Input value={$q} on:input={onInput} />
</div>
