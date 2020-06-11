import cookie from 'cookie'

const FL_CLOUD_TOKEN_KEY = 'fl-cloud-token'
const FL_CLOUD_USER_KEY = 'fl-cloud-user'

export const create = ( token, user ) => {
	setToken( token )
	setUser( user )
}

export const destroy = () => {
	removeToken()
	removeUser()
}

export const isValidToken = ( token ) => {
	return token && 'string' === typeof token
}

export const hasToken = () => {
	const token = getToken()
	return isValidToken( token )
}

export const getToken = () => {
	const cookies = cookie.parse( document.cookie )
	return cookies[ FL_CLOUD_TOKEN_KEY ] ? cookies[ FL_CLOUD_TOKEN_KEY ] : null
}

export const setToken = ( token ) => {
	document.cookie = cookie.serialize( FL_CLOUD_TOKEN_KEY, token, {
		expires: new Date( Date.now() + 1000 * 60 * 60 * 24 * 14 )
	} )
}

export const removeToken = () => {
	document.cookie = cookie.serialize( FL_CLOUD_TOKEN_KEY, '' )
}

export const isValidUser = ( user ) => {
	return ( 'object' === typeof user && user.hasOwnProperty( 'email' ) )
}

export const hasUser = () => {
	const user = getUser()
	return isValidUser( user )
}

export const getUser = () => {
	const cookies = cookie.parse( document.cookie )
	return cookies[ FL_CLOUD_USER_KEY ] ? JSON.parse( cookies[ FL_CLOUD_USER_KEY ] ) : null
}

export const setUser = ( user ) => {
	document.cookie = cookie.serialize( FL_CLOUD_USER_KEY, JSON.stringify( user ), {
		expires: new Date( Date.now() + 1000 * 60 * 60 * 24 * 14 )
	} )
}

export const removeUser = () => {
	document.cookie = cookie.serialize( FL_CLOUD_USER_KEY, '' )
}
