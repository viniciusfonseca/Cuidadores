import { noop } from '../App'

export const $timeout = duration => new Promise(resolve => setTimeout(resolve, duration))