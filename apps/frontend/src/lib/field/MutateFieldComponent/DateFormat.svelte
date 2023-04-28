<script lang="ts">
	import { Label, Select } from 'flowbite-svelte'
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { BUILT_IN_DATE_FORMATS, DEFAULT_DATE_FORMAT } from '@undb/core'
	import { onMount } from 'svelte'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let path: any[] = []

	const format = fieldProxy(form.form, [...path, 'format'] as any) as Writable<string>

	onMount(() => {
		$format = DEFAULT_DATE_FORMAT
	})

	const items = BUILT_IN_DATE_FORMATS.map((format) => ({ value: format, name: format }))
</script>

<div>
	<Label class="space-y-2">
		<span>{$t('Date Format')}</span>
		<Select bind:value={$format} {items} />
	</Label>
</div>
