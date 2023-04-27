const colors = require('tailwindcss/colors')

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				// Now we build the full color palette, using all colors available
				// as shown at this link: https://tailwindcss.com/docs/customizing-colors#color-palette-reference
				transparent: 'transparent',
				current: 'currentColor',

				black: '#000',
				white: '#fff',
				slate: colors.slate,
				gray: colors.gray,
				zinc: colors.zinc,
				neutral: colors.neutral,
				stone: colors.stone,
				red: colors.red,
				orange: colors.orange,
				amber: colors.amber,
				yellow: colors.yellow,
				lime: colors.lime,
				green: colors.green,
				emerald: colors.emerald,
				teal: colors.teal,
				cyan: colors.cyan,
				sky: colors.sky,
				blue: colors.blue,
				indigo: colors.indigo,
				violet: colors.violet,
				purple: colors.purple,
				fuchsia: colors.fuchsia,
				pink: colors.pink,
				rose: colors.rose,
			},
		},
	},

	plugins: [require('flowbite/plugin'), require('@tailwindcss/forms')],
	darkMode: 'class',
}

module.exports = config
