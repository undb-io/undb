<script lang="ts">
  import * as Pagination from "$lib/components/ui/pagination"

  export let perPage: number
  export let currentPage: number = 1

  export let count: number
</script>

<Pagination.Root
  {count}
  {perPage}
  let:pages
  let:currentPage
  class="mx-0 flex-1"
  onPageChange={(page) => (currentPage = page)}
>
  <Pagination.Content class="self-end">
    <Pagination.Item>
      <Pagination.PrevButton />
    </Pagination.Item>
    {#each pages as page (page.key)}
      {#if page.type === "ellipsis"}
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
      {:else}
        <Pagination.Item isVisible={currentPage === page.value}>
          <Pagination.Link {page} isActive={currentPage === page.value}>
            {page.value}
          </Pagination.Link>
        </Pagination.Item>
      {/if}
    {/each}
    <Pagination.Item>
      <Pagination.NextButton />
    </Pagination.Item>
  </Pagination.Content>
</Pagination.Root>
