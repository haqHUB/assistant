import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Form, Icon } from 'ui'
import { Page, Button } from 'fluid/ui'
import { getSystemConfig } from 'data'
import { getWpRest } from 'utils/wordpress'


export const Comment = ({ location }) => {
	const { item } = location.state
	const { id, approved, author, date, authorEmail, authorIP, content } = item
	const { pluginURL } = getSystemConfig()
	const hero = `${pluginURL}img/comment-hero-a.jpg`
	const comments = getWpRest()

	const [responseMessage, set_responseMessage] = React.useState({
		message: '',
		status: ''
	})
	const [commentStatus, set_commentStatus] = React.useState(approved)
	const [editContent, setEditContent] = React.useState(content)

	const { renderForm } = Form.useForm({
		sections: {
			details: {
				label: __('Details'),
				fields: {
					email: {
						label: __('Email Address'),
						labelPlacement: 'beside',
						type: 'text',
						value: authorEmail,
						component: 'plain-text'
					},
					IPAddress: {
						label: __('IP Address'),
						labelPlacement: 'beside',
						type: 'text',
						value: authorIP,
						component: 'plain-text'
					},
					date: {
						label: __('Submitted On'),
						labelPlacement: 'beside',
						type: 'text',
						value: date,
						component: 'plain-text'
					}
				}
			},
			actions: {
				label: __('Actions'),
				fields: {
					actions: {
						component: 'actions',
						options: [{ label: 'Test' }, { label: 'Test Again' }]
					}
				}
			}
		},
		defaults: item
	})

	const approveComment = () => {
		comments
			.comments()
			.update(id, 'approve', item)
			.then(response => {
				if (response.data.commentData.comment_approved == '1') {
					set_responseMessage({
						message: 'Comment Approved!',
						status: 'alert'
					})
					set_commentStatus('approve')
				}
			})
	}

	const unapproveComment = () => {
		comments
			.comments()
			.update(id, 'unapprove', item)
			.then(response => {
				if (response.data.commentData.comment_approved == '0') {
					set_responseMessage({
						message: `Comment Un-Approved!`,
						status: 'destructive'
					})
					set_commentStatus(false)
				}
			})
	}

	const trashComment = () => {
		comments
			.comments()
			.update(id, 'trash', item)
			.then(response => {
				if (response.data.commentData.comment_approved == 'trash') {
					set_responseMessage({
						message: `Comment has been moved to trashed!`,
						status: 'destructive'
					})
					set_commentStatus('trash')
				}
			})
	}

	const untrashComment = () => {
		comments
			.comments()
			.update(id, 'untrash', item)
			.then(response => {
				set_responseMessage({
					message: `Comment has been Restored!`,
					status: 'primary'
				})
				set_commentStatus(approved)
			})
	}

	const editComment = status => {
		set_commentStatus('edit')
	}

	const updateContent = () => {
		comments
			.comments()
			.update(id, 'content', { content: editContent })
			.then(response => {
				set_responseMessage({
					message: `Comment has been updated!`,
					status: 'primary'
				})
				set_commentStatus('update')
			})
	}

	return (
		<Page title={__('Edit Comment')} hero={hero}>
			<Page.Headline>{author}</Page.Headline>
			<div>{sprintf('commented on %s', date)}</div>

			{commentStatus !== 'edit' && (
				<div
					className='fl-asst-content-area'
					dangerouslySetInnerHTML={{ __html: editContent }}
				/>
			)}
			{commentStatus == 'edit' && (
				<textarea
					value={editContent}
					onChange={e => setEditContent(e.target.value)}
					rows={2}
				/>
			)}
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-evenly',
					margin: '10px 0 20px'
				}}
			>
				{commentStatus !== 'trash' &&
					commentStatus !== 'approve' &&
					commentStatus == false && (
						<Button
							appearance='elevator'
							status='primary'
							title='Approve'
							onClick={approveComment}
						>
							<Icon.Approve />
						</Button>
					)}

				{commentStatus !== 'trash' && (
					<Button
						appearance='elevator'
						status='alert'
						title='Reject'
						onClick={unapproveComment}
					>
						<Icon.Reject />
					</Button>
				)}
				{commentStatus !== 'trash' && (
					<Button appearance='elevator' title='Reply'>
						<Icon.Reply />
					</Button>
				)}
				{commentStatus !== 'edit' && (
					<Button appearance='elevator' title='Edit' onClick={editComment}>
						<Icon.Edit />
					</Button>
				)}
				{commentStatus == 'edit' && (
					<Button appearance='elevator' title='Save' onClick={updateContent}>
						Save
          </Button>
				)}
				{commentStatus !== 'trash' && (
					<Button
						appearance='elevator'
						status='destructive'
						title='Trash'
						onClick={trashComment}
					>
						<Icon.Trash />
					</Button>
				)}
				{commentStatus == 'trash' && (
					<Button
						appearance='elevator'
						status='primary'
						title='UnTrash'
						onClick={untrashComment}
					>
						<Icon.Restore />
					</Button>
				)}
			</div>

			{responseMessage.message && (
				<Button status={responseMessage.status}>
					{responseMessage.message}
				</Button>
			)}

			{renderForm()}
		</Page>
	)
}
