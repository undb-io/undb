<script lang="ts">
  import { cn } from "$lib/utils"
  import type { RatingField } from "@undb/table"
  export let value: number = 0
  export let field: RatingField

  $: max = field.max
</script>

<div class={cn("flex h-full items-center", $$restProps.class)}>
  {#each Array(max) as _, i}
    <div class="group items-center">
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class={cn("h-5 w-5 cursor-pointer transition-colors", value > i ? "text-yellow-400" : "text-gray-300")}
        >
          <path
            fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clip-rule="evenodd"
          >
          </path>
        </svg>
      </span>
    </div>
  {/each}
</div>
