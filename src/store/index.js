import state from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutation'

// import { createStore } from 'vuex'
import { createStore } from '../vuex'

const store = createStore({
  state,
  actions,
  getters,
  mutations
})

export default store