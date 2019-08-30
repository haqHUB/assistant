// Public API
import { Appearance } from './appearance'
import { App } from './app'
import { Button } from './button'
import { Icon } from './art'
import { List } from './lists'
import { Page } from './pages'
import { Nav } from './nav'
import { Window } from './window'
import { Error } from './errors'
import { Control } from './controls'
import { Form } from './forms'

// Export for use inside system bundle - import from 'lib'
export * from './app'
export * from './appearance'
export * from './lists'
export * from './pages'
export * from './nav'
export * from './window'
export * from './button'
export * from './art'
export * from './errors'
export * from './controls'
export * from './forms'

// Export public API for use inside other bundles - import from 'assistant/ui'
export const api = {
	Appearance,
	App,
	Button,
	Icon,
	Window,
	Form,
	Control,
	List,
	Page,
	Error,
	Nav,
}
