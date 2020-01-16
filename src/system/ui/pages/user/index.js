import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'data'
import { Page, Form } from 'ui'

export const User = ( { location } ) => {
	const { item } = location.state
	const { id } = item
	const { currentUser } = getSystemConfig()
	const isYou = currentUser.id === id
	const { form, useFormContext } = Form.useFormData_Deprecated()

	return (
		<Page title={ isYou ? __( 'Your Profile' ) : __( 'Edit User' ) }
		>
			<Page.TitleCard title={ item.displayName }>
				{item.email}
			</Page.TitleCard>

			<Form { ...form }>
				<Page.RegisteredSections
					location={ {
						type: 'user'
					} }
					data={ {
						user: item,
						isYou,
						useFormData_Deprecated: useFormContext
					} }
				/>
			</Form>
		</Page>
	)
}
