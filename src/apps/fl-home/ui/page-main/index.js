import React from 'react'
import { Page } from 'assistant/ui'
import { HeaderBar, SearchResults, Widgets, useSearchResults } from 'home/ui'
import './style.scss'

const noop = () => {}

const Main = ( { baseURL } ) => {
	const { keyword, setKeyword, results, clearResults, isLoading } = useSearchResults()

	return (
		<Page
			id="cards"
			padX={ false }
			padY={ false }
			toolbar={ false }
			onLoad={ noop }
		>
			<HeaderBar
				keyword={ keyword }
				onClear={ () => {
					setKeyword( '' )
					clearResults()
				} }
				onInput={ val => setKeyword( val ) }
				onSuggestionClick={ val => setKeyword( val ) }
			/>

			{ '' !== keyword && (
				<SearchResults
					items={ results }
					isLoading={ isLoading }
					keyword={ keyword }
					baseURL={ baseURL }
				/>
			) }

			{ '' === keyword && <Widgets /> }
		</Page>
	)
}

export default Main
