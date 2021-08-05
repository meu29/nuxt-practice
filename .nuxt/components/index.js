import { wrapFunctional } from './utils'

export { default as Header } from '../../components/header.vue'

export const LazyHeader = import('../../components/header.vue' /* webpackChunkName: "components/header" */).then(c => wrapFunctional(c.default || c))
