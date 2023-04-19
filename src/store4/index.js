import { createStore } from "../vuex4"

const store = createStore({
  strict: true, // 是否开启严格模式(开启之后 状态只能通过 mutation 来修改)
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