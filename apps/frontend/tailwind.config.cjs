const colors = require('tailwindcss/colors')

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

	plugins: [require('flowbite/plugin')],

	theme: {
		extends: {
			colors: {
				transparent: 'transparent',
				current: 'currentColor',
				black: '#000',
				white: '#fff',
				...colors,
			},
		},
	},

	darkMode: 'class',
}

module.exports = config
