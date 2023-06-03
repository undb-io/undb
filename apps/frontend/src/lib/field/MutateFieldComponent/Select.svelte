<script lang="ts">
	import { Alert, Label } from 'flowbite-svelte'
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import OptionsInput from '../FieldInputs/OptionsInput.svelte'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'
	import type { FieldTypeConvertStrategy } from '@undb/core'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let path: any[] = []
	export let isUpdatingType = false
	export let fieldConvertStrategy: FieldTypeConvertStrategy | undefined = undefined

	const options = fieldProxy(form.form, [...path, 'options'] as any) as Writable<any>
</script>

{#if isUpdatingType && fieldConvertStrategy === 'match'}
	<Alert>{$t('updatingType.select')}</Alert>
{:else}
	<div class="space-y-2">
		<Label class="space-y-2">
			<span>{$t('Options')}</span>
		</Label>
		<OptionsInput bind:value={$options} />
	</div>
{/if}
