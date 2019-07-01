import { useContext } from 'fl-react'
import { App } from 'lib'
import { getCache, setCache } from 'shared-utils/cache'
import { registerStore, useStore, getStore, getDispatch } from 'shared-utils/store'
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
	} = args

	const storeKey = `app:${ key }/state`
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
		setCache( 'app-state', key, getStore( storeKey ).getState(), false )
	} )
}

export const useAppState = ( key ) => {
	const app = key ? key : useContext( App.Context ).app
	return useStore( `${ app }/state` )
}

export const getAppActions = ( key ) => {
	const app = key ? key : useContext( App.Context ).app
	return getDispatch( `${ key ? key : app }/state` )
}