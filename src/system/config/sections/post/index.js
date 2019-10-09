import React from 'fl-react'
import { getSystemActions, getSystemConfig } from 'store'
import { Form, Control, List } from 'lib'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-post-title', {
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const { title, slug, url } = useForm()

		return (
			<>
				<Form.TextItem { ...title } />
				<Form.TextItem { ...slug } />
				<Form.Item label={ url.label }>
					<Control.URL
						id={ url.id }
						value={ url.value }
					/>
				</Form.Item>
			</>
		)
	},
} )

registerSection( 'fl-post-publish', {
	label: __( 'Publish Settings' ),
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const { status, visibility, password, date } = useForm()
		return (
			<>
				<Form.PlainTextItem { ...status } />
				<Form.SelectItem { ...visibility } />
				<Form.TextItem { ...password } />
				<Form.PlainTextItem { ...date } />
			</>
		)
	},
} )

registerSection( 'fl-post-taxonomies', {
	label: __( 'Taxonomies' ),
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const { taxonomies } = getSystemConfig()
		const { terms } = useForm()

		const fields = Object.keys( terms.value ).map( ( slug, key ) => {
			const tax = taxonomies[ slug ]

			if ( tax.isHierarchical ) {
				return (
					<Form.SelectItem
						key={ key }
						label={ tax.labels.plural }
						selectMultiple={ true }
						options={ {
							a: 1,
							b: 2,
							c: 3,
							d: 4,
						} }
					/>
				)
			} else {
				const val = [
					{ id: 4, label: __( 'WordPress' ), onRemove: () => {} },
					{ id: 5, label: __( 'Best Posts' ), onRemove: () => {} },
					{ id: 6, label: __( 'Hot Dogs' ), onRemove: () => {} },
				]
				return (
					<Form.Item
						key={ key }
						label={ tax.labels.plural }
						labelForm={ `taxonomy-${ slug }` }
					>
						<Control.TagGroup value={ val } />
					</Form.Item>
				)
			}
		} )

		return fields
	},
} )

registerSection( 'fl-post-excerpt', {
	label: __( 'Excerpt' ),
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const { excerpt } = useForm()
		return (
			<>
				<Form.TextItem { ...excerpt } />
			</>
		)
	},
} )

registerSection( 'fl-post-attributes', {
	label: __( 'Attributes' ),
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const { parent, template, order } = useForm()
		return (
			<>
				<Form.SelectItem { ...template } />
				<Form.SelectItem { ...parent } />
				<Form.TextItem { ...order } />
			</>
		)
	},
} )

registerSection( 'fl-post-discussion', {
	label: __( 'Discussion' ),
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const { commentsAllowed, pingbacksAllowed } = useForm()
		return (
			<>
				<Form.CheckboxItem { ...commentsAllowed } />
				<Form.CheckboxItem { ...pingbacksAllowed } />
			</>
		)
	},
} )

registerSection( 'fl-post-comments', {
	label: 'Comments',
	location: {
		type: 'post',
		tab: 'comments',
	},
	contentStyle: { padding: 0 },
	render: ( { post } ) => {
		return (
			<List.Comments
				query={ { post__in: [ post.id ] } }
				getItemProps={ ( item, defaultProps ) => ( {
					...defaultProps,
					to: {
						pathname: `/fl-comments/comment/${item.id}`,
						state: { item }
					},
				} ) }
			/>
		)
	},
} )


// Create Post Screen
registerSection( 'fl-new-post-title', {
	label: 'Basic Info',
	location: {
		type: 'create-post',
	},
	render: ( { useForm } ) => {
		const { type, title, slug, parent } = useForm()
		return (
			<>
				<Form.SelectItem { ...type } />
				<Form.TextItem { ...title } />
				<Form.TextItem { ...slug } />
				<Form.SelectItem { ...parent } />
			</>
		)
	},
} )
