import React from 'react'
import { __ } from '@wordpress/i18n'
import { Layout } from 'ui'
import CloudLayout from '../layout'

export default () => {

	return (
		<CloudLayout>
			<Layout.Headline>{ __( 'Your Profile' ) }</Layout.Headline>
		</CloudLayout>
	)
}
