<script lang="ts">
	import {
		Icon123,
		IconBinaryTree,
		IconCalculator,
		IconCalendar,
		IconCalendarPlus,
		IconCalendarStats,
		IconCalendarTime,
		IconHierarchy,
		IconKey,
		IconLetterT,
		IconListCheck,
		IconMail,
		IconMathXDivideY2,
		IconPalette,
		IconPaperclip,
		IconRelationManyToMany,
		IconSearch,
		IconSortAscendingNumbers,
		IconSquareCheck,
		IconStars,
		IconSum,
		IconUser,
	} from '@tabler/icons-svelte'
	import type { IFieldType } from '@undb/core'
	import type { ComponentType } from 'svelte'

	export let type: IFieldType

	export let size: number | undefined = undefined

	const map: Record<IFieldType, ComponentType> = {
		string: IconLetterT,
		number: Icon123,
		id: IconKey,
		'auto-increment': IconSortAscendingNumbers,
		average: IconMathXDivideY2,
		bool: IconSquareCheck,
		collaborator: IconUser,
		'date-range': IconCalendarTime,
		select: IconListCheck,
		date: IconCalendar,
		'created-at': IconCalendarPlus,
		'updated-at': IconCalendarStats,
		email: IconMail,
		color: IconPalette,
		reference: IconRelationManyToMany,
		tree: IconHierarchy,
		parent: IconBinaryTree,
		rating: IconStars,
		count: IconCalculator,
		lookup: IconSearch,
		sum: IconSum,
		attachment: IconPaperclip,
		'created-by': IconCalendarPlus,
		'updated-by': IconCalendarStats,
	}
</script>

<svelte:component this={map[type]} {size} />
