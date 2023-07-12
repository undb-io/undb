<script lang="ts">
	import { getTable } from '$lib/store/table'
	import EmptyForm from './EmptyForm.svelte'
	import FormListItem from './FormListItem.svelte'

	const table = getTable()

	const forms = $table.forms.forms
</script>

<div class="h-full">
	{#if !forms.length}
		<EmptyForm />
	{:else}
		{#each forms as form}
			<FormListItem {form} />
		{/each}
	{/if}
</div>
