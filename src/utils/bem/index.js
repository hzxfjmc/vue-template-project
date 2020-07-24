import { createBEM } from './bem'

export function createNamespace(name) {
    name = 'yx-' + name
    return [createBEM(name)]
}
