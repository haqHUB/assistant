import React from 'react'
import { Page } from 'assistant/ui'
import { __ } from '@wordpress/i18n'

export const HomeScreen = () => {
	return (
		<Page.NewPage padX={ false } padY={false} toolbar={false}>
			<Page.RegisteredSections
				location={ { type: 'home' } }
				data={ {} }
			/>
		</Page.NewPage>
	)
}
