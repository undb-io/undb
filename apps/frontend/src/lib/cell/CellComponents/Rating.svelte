<script lang="ts">
	import type { RatingField, RatingFieldValue } from '@undb/core'
	import RatingComponent from './RatingComponent.svelte'

	export let value: RatingFieldValue | undefined
	export let field: RatingField

	$: rating = value?.unpack() ?? 0
</script>

{#if value}
	<RatingComponent value={rating} max={field.max} />
{/if}
