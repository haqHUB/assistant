export const setIsCloudConnected = ( isConnected ) => {
	return {
		type: 'SET_IS_CLOUD_CONNECTED',
		isConnected
	}
}

export const setCloudToken = ( token ) => {
	return {
		type: 'SET_CLOUD_TOKEN',
		token
	}
}

export const setCloudUser = ( user ) => {
	return {
		type: 'SET_CLOUD_USER',
		user
	}
}
