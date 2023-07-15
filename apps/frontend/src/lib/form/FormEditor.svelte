<script lang="ts">
	import FormFieldsEditor from './FormFieldsEditor.svelte'
	import FormHiddenFields from './FormHiddenFields.svelte'
</script>

<main class="grid grid-cols-6 gap-4">
	<div class="col-span-2">
		<FormHiddenFields />
	</div>
	<div class="col-span-4">
		<FormFieldsEditor />
	</div>
</main>
