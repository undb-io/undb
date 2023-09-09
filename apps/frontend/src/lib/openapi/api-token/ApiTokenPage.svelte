<script lang="ts">
	import { trpc } from '$lib/trpc/client'
	import ApiTokenTable from './ApiTokenTable.svelte'
	import EmptyApiToken from './EmptyApiToken.svelte'

	const getApiTokens = trpc().openapi.apiToken.list.query()

	$: apiTokens = $getApiTokens.data?.apiTokens ?? []
</script>

{#if $getApiTokens.isLoading}
	<i class="ti ti-rotate text-2xl font-bold animate-spin"></i>
{:else if !apiTokens.length}
	<EmptyApiToken />
{:else}
	<ApiTokenTable {apiTokens} />
{/if}
