import React, { Fragment, useState } from 'react'
import { TagGroup, Tag, TagGroupControl, ScreenHeader, ExpandedContents, ContentList } from 'components'
import { getWeek } from 'utils'

export const FindTab = props => {
    const [type, setType] = useState('posts')
    const [subType, setSubType] = useState('page')
    const [date, setDate] = useState()

    const typeTags = [
        {
            label: 'Posts',
            value: ['posts', 'post'],
        },
        {
            label: 'Pages',
            value: ['posts', 'page'],
        },
        {
            label: 'Media',
            value: ['posts', 'attachment'],
        },
        {
            label: 'Categories',
            value: ['terms', 'category'],
        },
        {
            label: 'Tags',
            value: ['terms', 'post_tag'],
        },
    ]
    const changeType = value => {
        if ( Array.isArray(value) ) {
            const [type, subType] = value
            setType(type)
            setSubType(subType)
        } else {
            setType(value)
        }
    }

    const dateTags = [
        {
            label: 'Any',
            value: '',
        },
        {
            label: 'Today',
            value: 'today',
        },
        {
            label: 'This Week',
            value: 'week',
        },
        {
            label: 'This Month',
            value: 'month',
        },
        {
            label: '2019',
            value: 'year'
        }
    ]
    const changeDate = value => {
        console.log('set date', value )
        setDate(value)
    }

    // Setup the query
    let query = {}
    let typeTagValue = [type, subType] // Value to pass to the 'type' tag group

    switch(type) {

        // Handle post queries
        case 'posts':
            query = {
                post_type: subType,
                numberposts: -1,
                orderby: 'title',
                order: 'ASC',
                s: '',
            }

            const now = new Date()
            switch(date) {
                case 'today':
                    query['year'] = now.getFullYear()
                    query['month'] = now.getMonth() + 1
                    query['day'] = now.getDay()
                    break
                case 'week':
                    query['year'] = now.getFullYear()
                    query['w'] = getWeek(now)
                    break
                case 'month':
                    query['year'] = now.getFullYear()
                    query['month'] = now.getMonth() + 1
                    break
                case 'year':
                    query['year'] = now.getFullYear()
                    break
            }
            break

        // Handle taxonomy queries
        case 'terms':
            query = {
                taxonomy: subType,
                'hide_empty': false
            }
            typeTagValue = [type, subType]
            break
    }

    return (
        <Fragment>
            <ScreenHeader>
                <TagGroupControl tags={typeTags} value={typeTagValue} onChange={changeType} appearance="vibrant" />
                <ExpandedContents>
                    <TagGroupControl tags={dateTags} value={date} title="Created" onChange={changeDate} />
                </ExpandedContents>
            </ScreenHeader>

			<ContentList
				type={type}
				query={query}
                itemConfig={{
                    showThumb: true,
            		showMeta: true,
            		showActions: true,
                }}
			/>
        </Fragment>
    )
}

export const FindIcon = props => {
    return (
        <svg width="29px" height="24px" viewBox="0 0 29 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g fill="transparent" transform="translate(-145.000000, -145.000000)" fillRule="nonzero" strokeWidth="2" stroke="currentColor">
                <circle cx="158.5" cy="155.5" r="5.5"></circle>
                <path d="M172.014075,163 L172.014075,148 C172.014075,146.895431 171.118644,146 170.014075,146 L148,146 C146.895431,146 146,146.895431 146,148 L146,165.010842 C146,166.115411 146.895431,167.010842 148,167.010842 L170.014075,167.010842 L162.5,159.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
        </svg>
    )
}
