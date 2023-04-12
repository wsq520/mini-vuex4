import { createStore } from "../vuex4"

const store = createStore({
  state: {
    count: 0
  },
  getters: {
    double(state) {
      return state.count * 2
    }
  },
  mutations: {
    add(state, payload) {
      state.count += payload
    }
  },
  actions: {
    addOne({ state }, payload) {
      console.log(state)
      state.count += payload
    }
  },
  modules: {
    aCount: {
      state: {
        count: 0
      },
      modules: {
        cCount: {
          state: {
            count: 2
          },
          mutations: {
            addOne(state, payload) {
              state.count += payload
            }
          }
        }
      }
    },
    bCount: {
      state: {
        count: 1
      }
    }
  }
})

export default store