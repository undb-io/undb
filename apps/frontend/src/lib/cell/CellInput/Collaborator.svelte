<script lang="ts">
	import type { CollaboratorField, Record } from '@undb/core'
	import UsersPicker from './UsersPicker.svelte'

	export let value: string[] | undefined = []
	export let record: Record | undefined
</script>

<UsersPicker bind:value {...$$restProps} />
