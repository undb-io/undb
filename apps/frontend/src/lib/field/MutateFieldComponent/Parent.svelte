<script lang="ts">
	import { Label } from 'flowbite-svelte'
	import { fieldProxy, formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import FieldsPicker from '../FieldInputs/FieldsPicker.svelte'
	import { getTable } from '$lib/store/table'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let isNew = false
	export let path: any[] = []

	const displayFieldIds = fieldProxy(form.form, [...path, 'displayFieldIds'] as any) as Writable<string[]>

	const table = getTable()
</script>

{#if !isNew}
	<div class="grid grid-cols-2 gap-2">
		<div class="space-y-2">
			<Label class="inline-flex items-center gap-2">
				<span>{$t('Display Fields') ?? undefined}</span>
			</Label>
			<div>
				<FieldsPicker
					class="w-full !justify-start"
					table={$table}
					bind:group={$displayFieldIds}
					disabled={!table}
					filter={(f) => f.isPrimitive()}
				/>
			</div>
		</div>
	</div>
{/if}
