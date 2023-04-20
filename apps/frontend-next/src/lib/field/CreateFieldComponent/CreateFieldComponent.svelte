<script lang="ts">
	import Rating from './Rating.svelte'

	import type { SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms/index'
	import type { AnyZodObject } from 'zod'

	import type { IFieldType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import Reference from './Reference.svelte'

	export let type: IFieldType

	type T = $$Generic<AnyZodObject>
	export let form: SuperForm<UnwrapEffects<T>, unknown>

	const map: Partial<Record<IFieldType, ComponentType>> = {
		reference: Reference,
		rating: Rating,
	}
</script>

<svelte:component this={map[type]} {form} />
