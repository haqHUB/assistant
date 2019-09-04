import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { List, Button, Icon } from 'lib'
import Clipboard from 'react-clipboard.js'
import { getWpRest } from 'shared-utils/wordpress'

export const Posts = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	...rest,
} ) => {
	const { update, clone } = getWpRest().posts()

	return (
		<List.WordPress
			type={ 'posts' }
			query={ query }
			defaultItemProps={ {
				shouldAlwaysShowThumbnail: true
			} }
			getItemProps={ ( item, defaultProps ) => {
				const { cloneItem, updateItem, updateItemBy } = defaultProps

				const clonePost = () => {
					const clonedItem = cloneItem( {
						id: null,
						author: null,
						visibility: null,
						title: __( 'Cloning...' ),
						isCloning: true,
					} )
					clone( item.id ).then( response => {
						updateItemBy( 'uuid', clonedItem.uuid, {
							...response.data,
							isCloning: false,
						} )
					} )
				}

				const trashPost = () => {
					if ( confirm( __( 'Do you really want to trash this post?' ) ) ) {
						const { id, uuid } = item
						updateItem( {
							id: null,
							title: __( 'Moving item to trash' ),
							author: null,
							visibility: null,
							isTrashing: true,
							trashedItem: Object.assign( {}, item ),
						} )
						update( id, 'trash' ).then( () => {
							updateItemBy( 'uuid', uuid, {
								title: __( 'This item has been moved to the trash' ),
								isTrashing: false,
								isTrashed: true,
							} )
						} )
					}
				}

				const restorePost = () => {
					updateItemBy( 'uuid', item.uuid, {
						title: __( 'Restoring item' ),
						isTrashed: false,
						isRestoring: true,
					} )
					update( item.trashedItem.id, 'untrash' ).then( () => {
						updateItemBy( 'uuid', item.trashedItem.uuid, {
							...item.trashedItem,
							isRestoring: false,
						} )
					} )
				}

				const getDescription = () => {
					if ( item.author && item.visibility ) {
						return __( 'by' ) + ' ' + item.author + ' | ' + item.visibility
					} else if ( item.author ) {
						return __( 'by' ) + ' ' + item.author
					} else if ( item.visibility ) {
						return item.visibility
					}
				}

				const Accessory = () => {
					if ( item.isTrashed ) {
						return <Button onClick={ restorePost } tabIndex="-1">Restore</Button>
					}
					return null
				}

				const Extras = () => {
					if ( item.isCloning || item.isTrashing || item.isTrashed || item.isRestoring ) {
						return null
					}
					return (
						<div className="fl-asst-item-extras">
							<div className="fl-asst-item-extras-left">
								<Button tabIndex="-1" href={ item.url }>{__( 'View' )}</Button>
								<Button tabIndex="-1" href={ item.editUrl }>{__( 'Edit' )}</Button>
								{ item.bbCanEdit &&
									<Button tabIndex="-1" href={ item.bbEditUrl }>{ item.bbBranding }</Button>
								}
							</div>
							<div className="fl-asst-item-extras-right">
								<Clipboard
									button-tabIndex={ '-1' }
									button-className={ 'fl-asst-button fl-asst-button-appearance-normal' }
									data-clipboard-text={ item.url }
								>
									<Icon.Link />
								</Clipboard>
								<Button tabIndex="-1">
									<Icon.Bookmark />
								</Button>
								<Button onClick={ clonePost } tabIndex="-1">
									<Icon.Clone />
								</Button>
								<Button onClick={ trashPost } tabIndex="-1" className="fl-asst-destructive">
									<Icon.Trash />
								</Button>
							</div>
						</div>
					)
				}

				return getItemProps( item, {
					...defaultProps,
					label: item.title,
					description: getDescription(),
					thumbnail: item.thumbnail,
					thumbnailSize: 'med',
					accessory: props => <Accessory { ...props } />,
					extras: props => <Extras { ...props } />,
				} )
			} }
			{ ...rest }
		/>
	)
}
