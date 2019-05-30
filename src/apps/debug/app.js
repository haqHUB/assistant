import React, { Fragment, useState } from 'react'
import { Appearance } from 'lib'
import { DesignSystemDocs } from 'lib/docs'
import { useSystemState } from 'store'

export const App = () => {
	const [ shouldShowDocs, setShouldShowDocs ] = useState( false )
	const toggleShowDocs = () => setShouldShowDocs( ! shouldShowDocs )

	const { window: { size, origin }, appearance } = useSystemState()
	const { brightness } = appearance

	let align = 'left'
	if ( 'undefined' !== typeof origin ) {
		if ( ! origin[0] ) {
			align = 'right'
		}
	}
	let margin = 0
	if ( 'normal' === size ) {
		margin = 460
	} else {
		margin = 380
	}
	return (
		<Fragment>
			<h1>Debug</h1>

			{ shouldShowDocs &&
			<Appearance brightness={ 'light' === brightness ? 'dark' : 'light' }>
				<DesignSystemDocs align={align} windowMargin={margin} />
			</Appearance>
			}
		</Fragment>
	)
}
