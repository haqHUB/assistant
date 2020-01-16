import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Form } from 'ui'

export const Term = ( { location } ) => {
	const { item } = location.state
	const { form, useFormContext } = Form.useFormData_Deprecated( {
		title: {
			label: __( 'Name' ),
			labelPlacement: 'beside',
		},
		slug: {
			label: __( 'Slug' ),
			labelPlacement: 'beside',
		},
		parent: {
			label: __( 'Parent' ),
			labelPlacement: 'beside',
			options: {
				'': __( 'None' ),
			},
		},
		description: {
			label: __( 'Description' ),
			type: 'textarea',
			rows: 4,
		},
	}, {}, item )

	return (
		<Page title={ __( 'Edit Term' ) } padX={ false }>
			<Form { ...form }>
				<Page.RegisteredSections
					location={ { type: 'term' } }
					data={ { useFormData_Deprecated: useFormContext } }
				/>
			</Form>
		</Page>
	)
}
