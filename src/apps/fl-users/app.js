import React from 'react'
import { Nav, Page } from 'assistant/lib'

import { Main } from './pages/main'
import { User } from './pages/user'
import { Search } from './pages/search'
import { Invite } from './pages/invite'

export const Users = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={ `${match.url}/` } component={ Main } />
		<Nav.Route path={ `${match.url}/search` } component={ Search }/>
		<Nav.Route path={ `${match.url}/invite` } component={ Invite }/>
		<Nav.Route path={ `${match.url}/user/:id` } component={ User } />
		<Nav.Route path={ `${match.url}/post/:id` } component={ Page.Post } />
	</Nav.Switch>
)


Users.Icon = () => {
	return (
		<svg width="28px" height="30px" viewBox="0 0 28 30" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g transform="translate(-11.000000, -10.000000)" fill="currentColor" fillRule="nonzero">
				<path d="M33.2288802,24.1605609 C32.893073,24.8016628 32.0895828,25.0550709 31.4342345,24.7265637 C30.7788863,24.3980565 30.5198471,23.612033 30.8556542,22.9709311 C31.3829986,21.9641583 31.6625841,20.8408781 31.6625841,19.6738541 C31.6625841,15.7642285 28.5214412,12.6086798 24.6646031,12.6086798 C20.807765,12.6086798 17.6666222,15.7642285 17.6666222,19.6738541 C17.6666222,23.5834798 20.807765,26.7390285 24.6646031,26.7390285 C27.4039029,26.7390285 29.7002074,27.0813035 32.1116986,28.2789796 C35.7358771,30.0789413 38.1871471,33.4095937 38.9844203,38.4978529 C39.0959907,39.2099035 38.5963783,39.875614 37.8685048,39.984759 C37.1406313,40.093904 36.4601276,39.6051524 36.3485572,38.8931019 C35.6811523,34.6336724 33.7599058,32.0231871 30.9045311,30.6050547 C28.9531266,29.6358823 27.0197822,29.3477082 24.6646031,29.3477082 C19.3189354,29.3477082 14.9999733,25.0089386 14.9999733,19.6738541 C14.9999733,14.3387696 19.3189354,10 24.6646031,10 C30.0102708,10 34.3292329,14.3387696 34.3292329,19.6738541 C34.3292329,21.2564471 33.9482135,22.7872549 33.2288802,24.1605609 Z M13.6666489,38.6954774 C13.6666489,39.4158444 13.0696992,39.9998173 12.3333244,39.9998173 C11.5969497,39.9998173 11,39.4158444 11,38.6954774 C11,34.6162198 11.8826489,32.491464 13.9756851,30.0344201 C14.4471007,29.4810188 15.2878481,29.4062487 15.8535468,29.8674165 C16.4192456,30.3285842 16.4956772,31.1510549 16.0242615,31.7044562 C14.310042,33.716802 13.6666489,35.2656095 13.6666489,38.6954774 Z"></path>
			</g>
		</svg>
	)
}
