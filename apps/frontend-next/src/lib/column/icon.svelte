<script lang="ts">
	import type { IFieldType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import { Star } from 'svelte-heros-v2'

	export let type: IFieldType

	const map: Record<IFieldType, ComponentType> = {
		string: Star,
		number: Star,
		id: Star,
		'auto-increment': Star,
		average: Star,
		bool: Star,
		collaborator: Star,
		'date-range': Star,
		select: Star,
		date: Star,
		'created-at': Star,
		'updated-at': Star,
		email: Star,
		color: Star,
		reference: Star,
		tree: Star,
		parent: Star,
		rating: Star,
		count: Star,
		lookup: Star,
		sum: Star,
		attachment: Star,
		'created-by': Star,
		'updated-by': Star,
	}
</script>

<svelte:component this={map[type]} />
