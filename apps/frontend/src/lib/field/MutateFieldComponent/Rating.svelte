<script lang="ts">
	import type { Writable } from 'svelte/store'

	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { RATING_MAX, RATING_MAX_DEFAULT } from '@undb/core'
	import { onMount } from 'svelte'
	import { t } from '$lib/i18n'
	import { Label } from '$components/ui/label'
	import { Input } from '$components/ui/input'

	export let path: any[] = []
	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const max = fieldProxy(form.form, [...path, 'max'] as any) as Writable<number>

	onMount(() => {
		if (!$max) {
			$max = RATING_MAX_DEFAULT as never
		}
	})
</script>

<div>
	<Label class="space-y-2">
		<span>{$t('Max', { ns: 'common' })}</span>
		<Input type="number" bind:value={$max} min={0} max={RATING_MAX} />
	</Label>
</div>
