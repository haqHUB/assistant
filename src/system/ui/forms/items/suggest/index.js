import React, { useEffect, useState, useRef } from 'react'
import { Control } from 'ui'
import './style.scss'

export const SuggestItem = ( {
	id,
	options = [],
	value = [],
	placeholder = '',
	onRemove = () => {},
	onAdd = () => {},
} ) => {
	const [ suggestOptions, setSuggestOptions ] = useState( null )
	const [ inputValue, setInputValue ] = useState( '' )
	const inputRef = useRef()

	useEffect( () => {
		if ( 2 > inputValue.length ) {
			setSuggestOptions( null )
			return
		}
		const newOptions = []
		Object.keys( options ).map( key => {
			if ( options[ key ].includes( inputValue ) ) {
				newOptions[ key ] = options[ key ]
			}
		} )
		setSuggestOptions( Object.keys( newOptions ).length ? newOptions : null )
	}, [ inputValue ] )

	const getTags = () => {
		const tags = []
		value.map( v => {
			if ( options[ v ] ) {
				tags.push( {
					id: v,
					label: options[ v ],
				} )
			}
		} )
		return tags
	}

	return (
		<div
			key={ id }
			id={ id }
			className='fl-asst-tag-group-suggest'
			onClick={ () => inputRef.current.focus() }
		>
			<Control.TagGroup
				value={ getTags() }
				onRemove={ ( tag ) => onRemove( tag.id ) }
			>
				<input
					type='text'
					ref={ inputRef }
					value={ inputValue }
					size={ inputValue.length ? inputValue.length + 1 : placeholder.length + 1 }
					placeholder={ placeholder }
					onChange={ e => setInputValue( e.target.value ) }
					onKeyDown={ e => {
						if ( 13 === e.keyCode ) {
							e.preventDefault()
							onAdd( inputValue )
							setInputValue( '' )
						}
					} }
				/>
				{ suggestOptions &&
					<div className='fl-asst-tag-group-suggest-menu'>
						{ Object.keys( suggestOptions ).map( ( key, i ) => {
							return (
								<div
									key={ i }
									className='fl-asst-tag-group-suggest-item'
									onClick={ () => {
										onAdd( suggestOptions[ key ] )
										setInputValue( '' )
									} }
								>
									{ suggestOptions[ key ] }
								</div>
							)
						} ) }
					</div>
				}
			</Control.TagGroup>
		</div>
	)
}
