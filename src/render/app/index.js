import React, { memo, Suspense, useEffect } from 'react'
import classname from 'classnames'
import { useLocation, Redirect, Route, Switch } from 'react-router-dom'
import { App, Page, Env, Error } from 'assistant/ui'
import { useSystemState, getSystemSelectors } from 'assistant/data'
import Sidebar from './side-bar'
import ErrorPage from './error-page'
import './style.scss'

const AppMain = () => {
	const location = useLocation()
	const { window, isAppHidden } = useSystemState( [ 'window', 'isAppHidden' ] )
	const { selectHomeKey } = getSystemSelectors()
	const side = window.origin[0]
	const sideName = side ? 'right' : 'left'
	const { isMobile } = Env.use()

	const classes = classname( {
		'fl-asst-main': true,
		'fl-asst-main-sidebar-only': isAppHidden,
		[`fl-asst-pinned-${sideName}`]: sideName,
		'fl-asst-is-mobile': isMobile,
	} )

	const home = selectHomeKey()

	return (
		<div className={ classes } >
			<Sidebar edge={ sideName } />

			{ ! isAppHidden && (
				<Error.Boundary alternate={ ErrorPage }>
					<div className="fl-asst-main-content" >
						<Switch location={ location }>
							<Route exact path="/">
								<Redirect to={ `/${home}` } />
							</Route>
							<Route path="/:app" component={ AppContent } />
							<Route component={ Page.NotFound } />
						</Switch>
					</div>
				</Error.Boundary>
			)}
		</div>
	)
}

const AppContent = () => {
	useSystemState( 'apps' )
	const { selectApp } = getSystemSelectors()
	const { isAppRoot, app: appName = '' } = App.useApp()
	const app = selectApp( appName )

	if ( ! app ) {
		return <Page.NotFound />
	}

	// Subsequent app changes
	useEffect( () => app.onMount(), [ appName ] )

	const appWrapClasses = classname( {
		'fl-asst-screen-content': true,
		'fl-asst-app-content': true,
		[`fl-asst-app-${appName}`]: appName,
		'fl-asst-app-root': isAppRoot,
	} )

	const props = {
		handle: app.handle,
		baseURL: `/${app.handle}`,
		label: app.label,
	}

	return (
		<div className={ appWrapClasses }>
			<Suspense fallback={ <Page.Loading /> }>
				<AppRoot root={ app.root } { ...props } />
			</Suspense>
		</div>
	)
}

const AppRoot = memo( ( { root: Root, ...rest } ) => {
	return Root ? <Root { ...rest } /> : <Page.NotFound />
} )

export default AppMain
