import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Nav } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import AuthLayout from './layout'

export default () => {

	const [ showSuccessMessage, setShowSuccessMessage ] = useState( false )
	const [ errorMessage, setErrorMessage ] = useState( null )

	const fields = {
		email: {
			label: __( 'Email Address' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter an email address.' ) )
				}
			}
		}
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { email } = values

		return cloud.auth.requestPasswordReset( email )
			.then( () => {
				setShowSuccessMessage( true )
			} )
			.catch( ( error ) => {
				setErrorMessage( error.message )
				setErrors( error.errors )
			} )
	}

	const {
		renderForm,
		submitForm,
		isSubmitting
	} = Form.useForm( {
		fields,
		onSubmit
	} )

	return (
		<AuthLayout>
			<Layout.Headline>{ __( 'Reset Password' ) }</Layout.Headline>
			{ showSuccessMessage && (
				<Layout.Box padX={ false }>
					<Layout.Message status='primary'>
						{ __( 'A password reset link has been sent.' ) }
					</Layout.Message>
				</Layout.Box>
			) }
			{ errorMessage && (
				<Layout.Box padX={ false }>
					<Layout.Message status='destructive'>
						{ errorMessage }
					</Layout.Message>
				</Layout.Box>
			) }
			{ renderForm() }
			<div className="fl-asst-auth-submit">
				<Button.Loading
					status="primary"
					onClick={ submitForm }
					isLoading={ isSubmitting }
				>
					{ __( 'Reset Password' ) }
				</Button.Loading>
				<div className="fl-asst-auth-links">
					<Nav.Link to="/fl-cloud/auth/login">{ __( 'Login' ) }</Nav.Link>
					<span> | </span>
					<Nav.Link to="/fl-cloud/auth/register">{ __( 'Register' ) }</Nav.Link>
				</div>
			</div>
		</AuthLayout>
	)
}
