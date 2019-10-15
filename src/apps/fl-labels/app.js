import React, { useEffect, useState } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { createSlug } from 'assistant/utils/url'
import { getWpRest } from 'assistant/utils/wordpress'
import { Color, Control, Page, Table, Button, Icon } from 'assistant/ui'
import './style.scss'

export const App = () => {
	const [ loading, setLoading ] = useState( false )
	const [ labels, setLabels ] = useState( [] )
	const [ editingLabel, setEditingLabel ] = useState( null )
	const [ newLabel, setNewLabel ] = useState( '' )
	const [ newColor, setNewColor ] = useState( '' )
	const wpRest = getWpRest()

	useEffect( () => {
		setLoading( true )
		wpRest.labels().findWhere().then( response => {
			setLoading( false )
			setLabels( [ ...response.data ] )
		} )
	}, [] )

	const saveEditingLabel = () => {
		if ( '' !== editingLabel.label ) {
			labels.map( ( label, key ) => {
				if ( editingLabel.id === label.id ) {
					labels[ key ] = editingLabel
					setLabels( [ ...labels ] )
				}
			} )
		}
		setEditingLabel( null )
	}

	const deleteLabel = ( id ) => {
		labels.map( ( label, key ) => {
			if ( id === label.id ) {
				labels.splice( key, 1 )
				setLabels( [ ...labels ] )
			}
		} )
	}

	const getDefaultColor = () => {
		const key = Object.keys( Color.knownColors ).shift()
		return Color.knownColors[ key ]
	}

	const addLabel = () => {
		if ( '' === newLabel ) {
			return
		}

		const slug = createSlug( newLabel )
		let exists = false

		labels.map( ( label, key ) => {
			if ( slug === label.slug ) {
				exists = true
			}
		} )

		if ( ! exists ) {
			labels.push( {
				slug,
				id: slug,
				label: newLabel,
				color: newColor ? newColor : getDefaultColor(),
			} )
			setLabels( [ ...labels ] )
		}

		setNewLabel( '' )
		setNewColor( '' )
	}

	const rows = labels.map( label => {
		if ( editingLabel && editingLabel.id === label.id ) {
			return {
				edit: (
					<>
						<input
							type='text'
							value={ editingLabel.label }
							onChange={ e => {
								setEditingLabel( {
									...editingLabel,
									label: e.target.value,
								} )
							} }
						/>
						<Control.CirclePicker
							value={ editingLabel.color }
							onChange={ value => {
								setEditingLabel( {
									...editingLabel,
									color: value,
								} )
							} }
						/>
						<Button.Group>
							<Button onClick={ saveEditingLabel }>{ __( 'Save' ) }</Button>
							<Button onClick={ () => setEditingLabel( null ) }>{ __( 'Cancel' ) }</Button>
						</Button.Group>
					</>
				)
			}
		}

		return {
			color: (
				<div
					className='fl-asst-label-color'
					style={ {
						backgroundColor: label.color
					} }>
				</div>
			),
			label: label.label,
			actions: (
				<Button.Group>
					<Button onClick={ () => setEditingLabel( label ) }>{ __( 'Edit' ) }</Button>
					<Button onClick={ () => deleteLabel( label.id ) } className="fl-asst-destructive">
						<Icon.Trash />
					</Button>
				</Button.Group>
			),
		}
	} )

	const InnerSection = ( { children } ) => {
		return (
			<Page.Pad top={ false } sides={ false }>
				{ children }
			</Page.Pad>
		)
	}

	return (
		<Page shouldPadSides={false}>
			<Page.Section
				label={ __( 'Edit Labels' ) }
				className='fl-asst-edit-labels'
			>
				<InnerSection>
					{ __( 'Labels allow you to mark posts for organization and collaborate with other users. Below you can add more labels and change the name of existing ones.' ) }
				</InnerSection>
				{ loading &&
					<InnerSection>{ __( 'Loading...' ) }</InnerSection>
				}
				<Table rows={ rows } />
			</Page.Section>

			<Page.Section
				label={ __( 'Add Label' ) }
				className='fl-asst-add-label'
			>
				<input
					type='text'
					placeholder={ __( 'Label' ) }
					value={ newLabel }
					onChange={ e => setNewLabel( e.target.value ) }
				/>
				<Control.CirclePicker
					value={ newColor }
					onChange={ value => setNewColor( value ) }
				/>
				<Button onClick={ addLabel }>
					{ __( 'Add New Label' ) }
				</Button>
			</Page.Section>

			<Page.Section label={ __( 'Bookmarks' ) }>
				<InnerSection>
					{ __( 'Bookmarks allow you to mark items privately. Only you will be able to see what items you’ve bookmarked.' ) }
				</InnerSection>
			</Page.Section>
		</Page>
	)
}

App.Icon = () => {
	return null
}
