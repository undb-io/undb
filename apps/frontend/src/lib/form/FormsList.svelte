<script lang="ts">
	import { getTable } from '$lib/store/table'
	import EmptyForm from './EmptyForm.svelte'
	import FormListItem from './FormListItem.svelte'

	const table = getTable()

	$: forms = $table.forms.forms
</script>

<div class="h-full">
	{#if !forms.length}
		<div class="h-full flex justify-center">
			<EmptyForm />
		</div>
	{:else}
		<div class="pt-5 space-y-3">
			{#each forms as form}
				<FormListItem {form} />
			{/each}
		</div>
	{/if}
</div>
