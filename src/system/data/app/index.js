import { useContext } from 'react'
import { App } from 'ui'
import { getCache, setCache } from 'utils/cache'
import { registerStore, useStore, getStore, getDispatch, getSelectors } from '../registry'
import {
	defaultState,
	defaultActions,
	defaultReducers,
	defaultEffects,
} from './defaults'

export const registerAppStore = args => {
	const {
		key,
		state: initialState,
		actions,
		reducers,
		effects,
		serialize = state => state
	} = args

	const storeKey = `${ key }/state`
	const cache = getCache( 'app-state', key )
	const state = {
		...defaultState,
		...initialState,
	}

	registerStore( storeKey, {
		state: cache ? { ...state, ...cache } : state,
		actions: { ...defaultActions, ...actions },
		reducers: { ...defaultReducers, ...reducers },
		effects: { ...defaultEffects, ...effects },
	} )

	getStore( storeKey ).subscribe( () => {
		const state = serialize( getStore( storeKey ).getState() )
		if ( false !== state ) {
			setCache( 'app-state', key, state, false )
		}
	} )
}

export const getAppStore = key => getStore( `${ key }/state` )

export const useAppState = ( key, needsRender = true ) => {
	const app = key ? key : useContext( App.Context ).app
	return useStore( `${ app }/state`, needsRender )
}

export const getAppActions = ( key ) => {
	const app = key ? key : useContext( App.Context ).app
	return getDispatch( `${ key ? key : app }/state` )
}

export const getAppSelectors = ( key ) => {
	const app = key ? key : useContext( App.Context ).app
	return getSelectors( `${ key ? key : app }/state` )
}
