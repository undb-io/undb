<script lang="ts">
	import type { IFieldType } from '@undb/core'
	import { getIconClass, icons } from './helpers'

	export let type: IFieldType

	export let size: number = 24
</script>

<i class={`${getIconClass(type)} text-[${size}px]`} />
