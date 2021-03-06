import React, { useMemo } from 'react'
import { __ } from '@wordpress/i18n'
import { Switch, Route, useHistory } from 'react-router-dom'
import { Nav, Button, Form, Page, Layout } from 'ui'
import { useFormData } from '../use-form-data'
import './style.scss'

export const useForm = ( {
	tabs = {},
	sections = {},
	fields = {},
	defaults = {},
	renderTabs = true,
	...options // See useFormData
} ) => {
	const tabData = useMemo( () => tabs, [ JSON.stringify( tabs ) ] )
	const sectionData = useMemo( () => sections, [ JSON.stringify( sections ) ] )
	const fieldData = useMemo( () => fields, [ JSON.stringify( fields ) ] )
	const fieldConfig = getFieldConfig( tabData, sectionData, fieldData, defaults )
	const defaultValues = getDefaultValues( fieldConfig, defaults )
	const formData = useFormData( { fields: fieldConfig, defaults: defaultValues, ...options } )
	const { form } = formData

	const renderForm = () => {
		if ( Object.entries( tabData ).length ) {
			return (
				<>
					{ renderTabs && <Tabs config={ tabData } /> }
					<Form { ...form }>
						<TabsContent config={ tabData } data={ formData } />
					</Form>
				</>
			)
		} else if ( Object.entries( sectionData ).length ) {
			return (
				<Form { ...form }>
					<Sections config={ sectionData } data={ formData } />
				</Form>
			)
		} else {
			return (
				<Form { ...form }>
					<Page.Section>
						<Fields config={ fieldData } data={ formData } />
					</Page.Section>
				</Form>
			)
		}
	}

	return { renderForm, ...formData }
}

const Tabs = ( { config } ) => {
	const history = useHistory()
	const location = history.location
	const { match } = Nav.useNavContext()

	const setTab = path => history.replace( path, location.state )
	return (
		<Layout.Box
			outset={ true }
			padX={ false }
			padY={ false }
			style={ {
				marginTop: 'var(--fluid-lg-space)'
			} }
		>
			<Button.Group appearance="tabs">
				{ Object.entries( config ).map( ( [ , tab ], i ) => {
					const { isVisible, label, path } = tab
					if ( undefined !== isVisible && ! isVisible ) {
						return
					}
					return (
						<Button key={ i }
							onClick={ () => setTab( path ? path : match.url ) }
							isSelected={ path === location.pathname }
						>
							{ label }
						</Button>
					)
				} ) }
			</Button.Group>
		</Layout.Box>
	)
}

const TabsContent = ( { config, data } ) => {
	const { match } = Nav.useNavContext()
	return (
		<Switch>
			{ Object.entries( config ).map( ( [ , tab ], i ) => {
				const { isVisible, path, exact, sections } = tab
				if ( undefined !== isVisible && ! isVisible ) {
					return
				}
				return (
					<Route
						key={ i }
						path={ path ? path : match.url }
						exact={ exact }
						render={ () => {
							if ( 'function' === typeof sections ) {
								const Component = sections
								return <Component { ...data } />
							}
							return <Sections config={ sections } data={ data } />
						} }
					/>
				)
			} ) }
			<Route render={ () => (
				<Layout.Box style={ {
					textAlign: 'center',
					fontSize: 16
				} } outset={ true }>
					{__( 'Oh no! We couldn\'t find that tab. Try Another' )}
				</Layout.Box>
			) } />
		</Switch>
	)
}

const Sections = ( { config, data } ) => {
	return Object.entries( config ).map( ( [ key, section ], i ) => {
		const { isVisible, label, fields, ...rest } = section
		if ( undefined !== isVisible && ! isVisible ) {
			return
		}
		return (
			<Page.Section key={ i } handle={ key } label={ label } { ...rest }>
				<Fields config={ fields } data={ data } />
			</Page.Section>
		)
	} )
}

const Fields = ( { config, data } ) => {
	if ( 'function' === typeof config ) {
		const Component = config
		return <Component { ...data } />
	}
	return Object.entries( config ).map( ( [ key ], i ) => {
		const {
			component,
			label,
			labelPlacement,
			id,
			isRequired,
			isVisible,
			isLoading,
			hasChanges,
			errors,
			...rest
		} = data.fields[ key ]
		if ( ! component ) {
			return null
		}
		const Field = getFieldComponent( component )
		return (
			<Form.Item
				key={ i }
				label={ label }
				labelPlacement={ labelPlacement }
				labelFor={ id }
				isRequired={ isRequired }
				isVisible={ isVisible }
				isLoading={ isLoading }
				hasChanges={ hasChanges }
				errors={ errors }
			>
				<Field id={ id } { ...rest } />
			</Form.Item>
		)
	} )
}

const getFieldComponent = key => {
	const map = {
		'actions': Form.ActionsItem,
		'checkbox': Form.CheckboxItem,
		'file': Form.FileItem,
		'labels': Form.LabelsItem,
		'plain-text': Form.PlainTextItem,
		'select': Form.SelectItem,
		'suggest': Form.SuggestItem,
		'taxonomy-terms': Form.TaxonomyTermsItem,
		'text': Form.TextItem,
		'textarea': Form.TextareaItem,
		'url': Form.UrlItem,
		'parent-terms': Form.ParentTermItems,
		'image': Form.ImageItem,
		'button': Form.ButtonItem,
		'calender': Form.CalenderItem
	}
	let Component = Form.TextItem

	if ( 'function' === typeof key ) {
		Component = key
	} else if ( map[ key ] ) {
		Component = map[ key ]
	}

	return Component
}

const getTabsFieldConfig = tabs => {
	let config = {}
	Object.values( tabs ).map( tab => {
		if ( ! tab.sections ) {
			return
		}
		config = Object.assign( config, getSectionsFieldConfig( tab.sections ) )
	} )
	return config
}

const getSectionsFieldConfig = sections => {
	let config = {}
	Object.values( sections ).map( section => {
		if ( ! section.fields ) {
			return
		} else if ( 'function' !== typeof section.fields ) {
			config = Object.assign( config, section.fields )
		}
	} )
	return config
}

const getFieldConfig = ( tabs, sections, fields, defaults ) => {
	let config = {}

	if ( Object.entries( tabs ).length ) {
		config = Object.assign( config, getTabsFieldConfig( tabs ) )
	} else if ( Object.entries( sections ).length ) {
		config = Object.assign( config, getSectionsFieldConfig( sections ) )
	} else if ( 'function' !== typeof fields ) {
		config = fields
	}

	Object.keys( defaults ).map( key => {
		if ( ! config[ key ] ) {
			config[ key ] = {}
		}
	} )

	return config
}

const getDefaultValues = ( fieldConfig, defaults ) => {
	Object.entries( fieldConfig ).map( ( [ key ] ) => {
		if ( undefined === defaults[ key ] ) {
			defaults[ key ] = ''
		}
	} )
	return defaults
}
