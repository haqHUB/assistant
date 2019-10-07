import { __ } from '@wordpress/i18n'
import { getWpRest } from 'shared-utils/wordpress'

export const setParentOptions = ( type, set ) => {
	const wpRest = getWpRest()
	wpRest.posts().hierarchical( {
		hide_empty: 0,
		post_type: type,
		posts_per_page: -1,
	} ).then( response => {
		if (
			'undefined' !== typeof response.data &&
			Array.isArray( response.data )
		) {
			const options = {}
			response.data.map( post => {
				options[ 'parent:' + post.id ] = post.title
				setParentChildOptions( options, post.children )
			} )
			set( 'parent', {
				0: __( 'None' ),
				...options,
			} )
		}
	} )

	// Initial
	return {
		0: __( 'None' ),
	}
}

const setParentChildOptions = ( options, children, depth = 1 ) => {
	const prefix = '-'.repeat( depth ) + ' '
	children.map( child => {
		options[ 'parent:' + child.id ] = prefix + child.title
		setParentChildOptions( options, child.children, depth + 1 )
	} )
}
