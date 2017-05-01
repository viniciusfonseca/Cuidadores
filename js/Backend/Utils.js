import { noop } from '../App'

export function $timeout(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration)
    })
}