import React, { useState } from 'react'
import { List, Button, Icon } from 'ui'
import { truncate } from 'utils/text'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import { getWpRest } from 'utils/wordpress'
export const Comments = ( {

	getItemProps = ( item, defaultProps ) => defaultProps,
	type = { type },
	query = {
		status: type,
	},
	...rest
} ) => {
	const comments = getWpRest()
	return (
		<List.WordPress
			type={ 'comments' }
			query={ query }
			getItemProps={ ( item, defaultProps ) => {

				const { updateItem } = defaultProps
				const [ approveStatus, setApproveStatus ] = useState( item.approved )
				const [ trashStatus, setTrashStatus ] = useState( item.trash )
				const [ spamStatus, setSpamStatus ] = useState( item.spam )

				const approveComment = () => {
					comments
						.comments()
						.update( item.id, 'approve', item )
						.then( response => {
							if ( '1' == response.data.commentData.comment_approved ) {
								item.approved = true
								setApproveStatus( true )
							}
						} )
				}

				const unapproveComment = () => {
					comments
						.comments()
						.update( item.id, 'unapprove', item )
						.then( response => {
							if ( '0' == response.data.commentData.comment_approved ) {
								item.approved = false
								setApproveStatus( false )
							}
						} )
				}

				const spamComment = () => {
					comments
						.comments()
						.update( item.id, 'spam', item )
						.then( () => {
							item.spam = true
							setSpamStatus( true )
							updateItem( item.uuid, {
								title: __( 'This item has been moved to the spam' ),
								isSpam: true,
								isunSpam: false
							} )
						} )
				}

				const unspamComment = () => {
					comments
						.comments()
						.update( item.id, 'unspam', item )
						.then( () => {
							item.spam = false
							setSpamStatus( false )
							updateItem( item.uuid, {
								title: __( 'This item has been restored from spam' ),
								isSpam: false,
								isunSpam: true
							} )
						} )
				}

				const trashComment = () => {
					if ( confirm( __( 'Do you really want to trash this item?' ) ) ) {

						comments
							.comments()
							.update( item.id, 'trash', item )
							.then( response => {

								if ( 'trash' == response.data.commentData.comment_approved ) {
									item.trash = true
									setTrashStatus( true )
									updateItem( item.uuid, {
										title: __( 'This item has been moved to the trash' ),
										isTrashing: true,
										isTrashed: true,
										isRestore: false
									} )
								}
							} )
					}

				}

				const untrashComment = () => {
					comments
						.comments()
						.update( item.id, 'untrash', item )
						.then( () => {

							item.trash = false
							setTrashStatus( false )
							updateItem( item.uuid, {
								title: __( 'This item has been restored from trash' ),
								isTrashing: false,
								isTrashed: false,
								isRestore: true
							} )
						} )
				}

				const Accessory = () => {
					if ( item.isTrashed && 'trash' !== type ) {
						return <Button onClick={ untrashComment } tabIndex="-1">Restore</Button>
					} else if ( false === item.isTrashed && 'trash' == type ) {
						return <Button onClick={ trashComment } tabIndex="-1">Trash</Button>
					}
					if ( item.isSpam && 'spam' !== type ) {
						return <Button onClick={ unspamComment } tabIndex="-1">Restore</Button>
					}
					if ( item.isunSpam && 'spam' == type ) {
						return <Button onClick={ spamComment } tabIndex="-1">Spam</Button>
					}
					return null
				}


				const Extras = () => {
					if (
						item.isCloning || item.isTrashing || item.isRestoring
					) {
						return null
					}
					return (
						<div className="fl-asst-item-extras">
							<Button
								href={ item.url }
								title={ __( 'View Comment' ) }
								tabIndex="-1"
								appearance="transparent"
							>
								<Icon.View  />
							</Button>

							{ approveStatus ? (
								<Button
									onClick={ unapproveComment }
									title={ __( 'Reject Comment' ) }
									tabIndex="-1"
									appearance="transparent"
									status="alert"
								>
									<Icon.Reject />
								</Button>
							) : (
								<Button
									onClick={ approveComment }
									title={ __( 'Approve Comment' ) }
									tabIndex="-1"
									appearance="transparent"
									status="primary"
								>
									<Icon.Approve />
								</Button>
							)}


							{ spamStatus ? (
								<Button
									onClick={ unspamComment }
									title={ __( 'Mark as not spam' ) }
									tabIndex="-1"
									appearance="transparent"
									status="primary"
								>
									<Icon.Unspam />
								</Button>
							) : (
								<Button
									onClick={ spamComment }
									title={ __( 'Mark as spam' ) }
									tabIndex="-1"
									appearance="transparent"
									status="alert"
								>
									<Icon.Spam />
								</Button>
							)}


							{ trashStatus ? (
								<Button
									onClick={ untrashComment }
									title={ __( 'Restore from trash' ) }
									tabIndex="-1"
									appearance="transparent"
								>
									<Icon.Restore />
								</Button>

							) : (
								<Button
									onClick={ trashComment }
									title={ __( 'Move to trash' ) }
									tabIndex="-1"
									appearance="transparent"
									status="destructive"
								>
									<Icon.Trash />
								</Button>
							)}
						</div>
					)
				}

				return getItemProps( item, {
					...defaultProps,
					label: ( item.isTrashing && 'trash' !== type ) ||
						( item.isSpam && 'spam' !== type ) ||
						( item.isunSpam && 'spam' == type ) ||
						( item.isRestore && 'trash' == type ) ?
						item.title :
						(
							<em>
								<strong>{item.authorEmail}</strong> commented:
							</em>
						),
					description: ( item.isTrashing && 'trash' !== type ) ||
						( item.isSpam && 'spam' !== type ) ||
						( item.isunSpam && 'spam' == type ) ||
						( item.isRestore && 'trash' == type ) ?
						''						:
						truncate( item.content.replace( /<\/?[^>]+(>|$)/g, '' ), 80 ),
					thumbnail: ( item.isTrashing && 'trash' !== type ) || ( item.isSpam && 'spam' !== type ) || ( item.isunSpam && 'spam' == type ) || ( item.isRestore && 'trash' == type ) ? '' : item.thumbnail,
					accessory: props => <Accessory { ...props } />,
					extras: props => <Extras { ...props } />,

					className: classname( {
						'fl-asst-list-item-alert': ! approveStatus
					}, defaultProps.className )
				} )
			} }
			{ ...rest }
		/>
	)
}
