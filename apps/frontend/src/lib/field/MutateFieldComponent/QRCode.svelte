<script lang="ts">
	import type { Writable } from 'svelte/store'

	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { t } from '$lib/i18n'
	import { Label } from '$components/ui/label'
	import Checkbox from '$components/ui/checkbox/checkbox.svelte'

	export let path: any[] = []
	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const displayRecordURL = fieldProxy(form.form, [...path, 'displayRecordURL'] as any) as Writable<boolean>
</script>

<div>
	<Label class="flex items-center gap-2">
		<Checkbox bind:checked={$displayRecordURL} />
		<span>{$t('DisplayRecordURL')}</span>
	</Label>
</div>
